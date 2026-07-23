from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import zipfile

@login_required
def codedesk(request):
   contexto = {}
   if request.method == 'POST' and request.FILES.get('arquivo_zip'):
        arquivo_zip = request.FILES['arquivo_zip']

        # Segurança: Verifica se a extensão é realmente .zip
        if not arquivo_zip.name.endswith('.zip'):
            contexto['erro'] = "Apenas arquivos .zip são permitidos."
            return render(request, 'CodeDesk.html', contexto)

        alunos_dados = {}

        try:
            # Lê o arquivo zip diretamente da memória (não salva no HD do servidor)
            with zipfile.ZipFile(arquivo_zip, 'r') as z:
                for nome_caminho in z.namelist():
                    
                    # Ignorar diretórios (só queremos ler arquivos .c ou .txt)
                    if nome_caminho.endswith('/'):
                        continue

                    # Quebra o caminho pelas barras: ['prova-01', 'submissoes', 'ana-silva', 'p01.c']
                    partes = nome_caminho.split('/')

                    # Busca a posição da pasta 'submissoes' para saber onde está o nome do aluno
                    if 'submissoes' in partes:
                        idx = partes.index('submissoes')
                        
                        # Garante que existe a pasta do aluno e o arquivo depois de 'submissoes'
                        if len(partes) > idx + 2:
                            nome_aluno = partes[idx + 1]
                            nome_arquivo = partes[-1]

                            # Lê o conteúdo do arquivo
                            with z.open(nome_caminho) as f:
                                # Decodifica os bytes para texto (usa fallback para evitar erros de acento)
                                try:
                                    conteudo = f.read().decode('utf-8')
                                except UnicodeDecodeError:
                                    conteudo = f.read().decode('latin-1', errors='ignore')

                            # Inicializa a lista do aluno se ele ainda não existir no dicionário
                            if nome_aluno not in alunos_dados:
                                alunos_dados[nome_aluno] = []

                            # Adiciona o arquivo e o código na lista do aluno
                            alunos_dados[nome_aluno].append({
                                'arquivo': nome_arquivo,
                                'codigo': conteudo
                            })

            # Se o loop terminou e o dicionário continuou vazio, a estrutura estava errada
            if not alunos_dados:
                contexto['erro'] = "A estrutura do ZIP está incorreta. Certifique-se de que a pasta 'submissoes/' existe e contém as pastas dos alunos."
            else:
                contexto['alunos'] = alunos_dados

        except zipfile.BadZipFile:
            contexto['erro'] = "O arquivo enviado está corrompido ou não é um ZIP válido."

   return render(request, 'CodeDesk.html', contexto)