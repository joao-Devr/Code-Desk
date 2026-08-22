import os
import re
import zipfile

from django.shortcuts import render
from django.contrib.auth.decorators import login_required


EXTENSOES_SUPORTADAS = {'.c', '.h', '.cpp', '.hpp', '.py', '.java', '.js', '.ts', '.txt'}

TAMANHO_MAX_ZIP = 20 * 1024 * 1024            # 20 MB: tamanho do .zip compactado
TAMANHO_MAX_DESCOMPACTADO = 50 * 1024 * 1024  # 50 MB: soma de todos os arquivos já descompactados
MAX_ARQUIVOS_NO_ZIP = 2000                    # protege contra zip com arquivos demais
LINHAS_MAX_CABECALHO = 15                     # só olhamos o início do arquivo em busca do cabeçalho


# Nome do arquivo: a<id_curto>q<questao>t<tentativa>.<extensao>
# Ex.: a006820q02t01.py -> id_curto=006820, questao=02, tentativa=01
PADRAO_NOME_ARQUIVO = re.compile(
    r'^a(?P<id_curto>\d+)q(?P<questao>\d+)t(?P<tentativa>\d+)\.\w+$',
    re.IGNORECASE,
)

# Linhas do cabeçalho inserido em cada arquivo, ex.:
# "# Aluno: Nome do Estudante 20221234 (6820)"
# "# Questao: 2, 1a tentativa, nota: 3"
# "# Problema: Matrizes – Matriz Resultante de espaços vazios (1884)"
# "# Turma(s): FP1 3A, semestre: 2026/1, e-mail: nome@dominio.edu"
# "# Justificativa da nota: ..."
PADRAO_ALUNO = re.compile(r'Aluno:\s*(?P<nome>.+?)\s+(?P<matricula>\d+)\s*\((?P<id_curto>\d+)\)\s*$')
PADRAO_QUESTAO = re.compile(r'Questao:\s*(?P<questao>\d+),\s*(?P<tentativa>\d+)a?\s*tentativa,\s*nota:\s*(?P<nota>[\d.,]+)', re.IGNORECASE)
PADRAO_PROBLEMA = re.compile(r'Problema:\s*(?P<problema>.+?)\s*\((?P<problema_id>\d+)\)\s*$')
PADRAO_TURMA = re.compile(r'Turma\(s\):\s*(?P<turma>.+?),\s*semestre:\s*(?P<semestre>[\d/]+),\s*e-mail:\s*\[?(?P<email>[\w.\-]+@[\w.\-]+)\]?')
PADRAO_JUSTIFICATIVA = re.compile(r'Justificativa da nota:\s*(?P<justificativa>.*)$')

# Remove marcador de comentário (#, //, /*, *, --) do início da linha antes de comparar,
# assim o mesmo parser funciona em .py (#), .c/.java/.js (//) etc.
PADRAO_LIMPA_COMENTARIO = re.compile(r'^[\s#/*\-]+')


def _limpar_linha(linha):
    return PADRAO_LIMPA_COMENTARIO.sub('', linha).strip()


def _analisar_cabecalho(conteudo):
    """
    Lê só as primeiras linhas do arquivo (cabeçalho inserido pelo sistema de
    provas) e devolve um dict com os metadados encontrados. Qualquer campo
    não encontrado fica None """
    dados = {
        'nome': None, 'matricula': None, 'id_curto': None,
        'questao': None, 'tentativa': None, 'nota': None,
        'problema': None, 'turma': None, 'email': None, 'justificativa': None,
    }

    for linha in conteudo.splitlines()[:LINHAS_MAX_CABECALHO]:
        linha_limpa = _limpar_linha(linha)

        m = PADRAO_ALUNO.match(linha_limpa)
        if m:
            dados['nome'] = m.group('nome').strip()
            dados['matricula'] = m.group('matricula')
            dados['id_curto'] = m.group('id_curto')
            continue

        m = PADRAO_QUESTAO.search(linha_limpa)
        if m:
            dados['questao'] = m.group('questao').zfill(2)
            dados['tentativa'] = m.group('tentativa').zfill(2)
            dados['nota'] = m.group('nota').replace(',', '.')
            continue

        m = PADRAO_PROBLEMA.match(linha_limpa)
        if m:
            dados['problema'] = m.group('problema').strip()
            continue

        m = PADRAO_TURMA.search(linha_limpa)
        if m:
            dados['turma'] = m.group('turma').strip()
            dados['email'] = m.group('email')
            continue

        m = PADRAO_JUSTIFICATIVA.match(linha_limpa)
        if m:
            dados['justificativa'] = m.group('justificativa').strip()
            continue

    return dados


def _processar_zip(arquivo_zip):
    
    # Lê o .zip em memória e devolve (alunos_dados, erro).
    alunos_dados = {}

    with zipfile.ZipFile(arquivo_zip, 'r') as z:
        # Valida METADADOS antes de descompactar qualquer coisa
        infos = z.infolist()

        if len(infos) > MAX_ARQUIVOS_NO_ZIP:
            return None, f'O .zip tem {len(infos)} itens, acima do limite de {MAX_ARQUIVOS_NO_ZIP}.'

        tamanho_total = sum(info.file_size for info in infos)
        if tamanho_total > TAMANHO_MAX_DESCOMPACTADO:
            return None, 'O conteúdo do .zip é grande demais depois de descompactado.'

        for nome_caminho in z.namelist():
            if nome_caminho.endswith('/'):
                continue  # é uma pasta, não um arquivo

            nome_arquivo = os.path.basename(nome_caminho)

            _, extensao = os.path.splitext(nome_arquivo)
            if extensao.lower() not in EXTENSOES_SUPORTADAS:
                continue

            m = PADRAO_NOME_ARQUIVO.match(nome_arquivo)
            if not m:
                continue  # não segue o padrão axxxxxqyytzz.ext -> ignora

            id_curto_nome = m.group('id_curto')
            questao_nome = m.group('questao').zfill(2)
            tentativa_nome = m.group('tentativa').zfill(2)

            with z.open(nome_caminho) as f:
                bruto = f.read()
            try:
                conteudo = bruto.decode('utf-8')
            except UnicodeDecodeError:
                conteudo = bruto.decode('latin-1', errors='ignore')

            cabecalho = _analisar_cabecalho(conteudo)

            # Prioriza os dados do cabeçalho (mais completos); usa o nome do
            # arquivo como reserva quando o cabeçalho não pôde ser lido.
            id_curto = (cabecalho['id_curto'] or id_curto_nome).lstrip('0') or '0'
            questao = cabecalho['questao'] or questao_nome
            tentativa = cabecalho['tentativa'] or tentativa_nome

            if id_curto not in alunos_dados:
                alunos_dados[id_curto] = {
                    'nome': cabecalho['nome'] or f'Aluno {id_curto}',
                    'matricula': cabecalho['matricula'],
                    'turma': cabecalho['turma'],
                    'arquivos': [],
                }
            elif cabecalho['nome'] and alunos_dados[id_curto]['nome'].startswith('Aluno '):
                # Se um arquivo anterior não tinha cabeçalho legível mas este tem, atualiza o nome
                alunos_dados[id_curto]['nome'] = cabecalho['nome']

            alunos_dados[id_curto]['arquivos'].append({
                'arquivo': nome_arquivo,
                'codigo': conteudo,
                'questao': questao,
                'tentativa': tentativa,
                'problema': cabecalho['problema'] or '',
                'nota_dredd': cabecalho['nota'] or '',
                'justificativa': cabecalho['justificativa'] or '',
            })

    for aluno in alunos_dados.values():
        aluno['arquivos'].sort(key=lambda item: (item['questao'], item['tentativa']))

    if not alunos_dados:
        return None, 'Nenhum arquivo no padrão axxxxxqyytzz.ext foi encontrado no .zip.'

    return alunos_dados, None


@login_required
def codedesk(request):
    contexto = {}

    if request.method == 'POST' and request.FILES.get('arquivo_zip'):
        arquivo_zip = request.FILES['arquivo_zip']

        # Segurança: extensão do arquivo enviado
        if not arquivo_zip.name.lower().endswith('.zip'):
            contexto['erro'] = "Apenas arquivos .zip são permitidos."
            return render(request, 'CodeDesk.html', contexto)

        # Segurança: tamanho do arquivo enviado (antes mesmo de abrir o zip)
        if arquivo_zip.size > TAMANHO_MAX_ZIP:
            contexto['erro'] = f"Arquivo maior que o limite de {TAMANHO_MAX_ZIP // (1024 * 1024)} MB."
            return render(request, 'CodeDesk.html', contexto)

        try:
            alunos_dados, erro = _processar_zip(arquivo_zip)
        except zipfile.BadZipFile:
            contexto['erro'] = "O arquivo enviado está corrompido ou não é um ZIP válido."
            return render(request, 'CodeDesk.html', contexto)

        if erro:
            contexto['erro'] = erro
        else:
            contexto['alunos'] = alunos_dados

    return render(request, 'CodeDesk.html', contexto)