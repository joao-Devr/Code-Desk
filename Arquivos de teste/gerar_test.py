import zipfile
import os

# ============================================================
# DADOS DO ALUNO
# ============================================================

nome_aluno = "Douglas de Oliveira Silva"
matricula = "20421234"
codigo_aluno = "4020"
email = "douglas.oliveira@estudante.ufla.br"

prova = "Prova 3 - Quinta 15"
codigo_prova = "2669"

turma = "FP1 3A"
semestre = "2026/1"

# Nome do arquivo ZIP que será criado
nome_zip = f"a{codigo_aluno}_programas.zip"


# ============================================================
# QUESTÕES
# ============================================================
# Para adicionar novas questões, basta copiar um bloco abaixo.

questoes = [
    {
        "questao": "02",
        "tentativa": "01",
        "nota": "3",
        "problema": "Matrizes – Matriz Resultante de espaços vazios",
        "codigo_problema": "1884",
        "justificativa": "A quantidade de dados escritos pelo programa é diferente da quantidade de dados esperados.",
        "codigo": '''
# Programa simples para trabalhar com matriz

linhas = int(input("Digite o número de linhas: "))
colunas = int(input("Digite o número de colunas: "))

matriz = []

for i in range(linhas):
    linha = []
    for j in range(colunas):
        valor = input(f"Digite o valor [{i}][{j}]: ")
        linha.append(valor)

    matriz.append(linha)

print("\\nMatriz resultante:")

for linha in matriz:
    print(*linha)
'''
    },

    {
        "questao": "03",
        "tentativa": "01",
        "nota": "10",
        "problema": "Soma de números",
        "codigo_problema": "0001",
        "justificativa": "Questão resolvida corretamente.",
        "codigo": '''
# Programa para somar dois números

numero1 = float(input("Digite o primeiro número: "))
numero2 = float(input("Digite o segundo número: "))

soma = numero1 + numero2

print("Resultado:", soma)
'''
    },

    {
        "questao": "04",
        "tentativa": "01",
        "nota": "10",
        "problema": "Média de três números",
        "codigo_problema": "0002",
        "justificativa": "Questão resolvida corretamente.",
        "codigo": '''
# Programa para calcular a média de três números

n1 = float(input("Digite a primeira nota: "))
n2 = float(input("Digite a segunda nota: "))
n3 = float(input("Digite a terceira nota: "))

media = (n1 + n2 + n3) / 3

print("Média:", media)
'''
    }
]


# ============================================================
# CRIAÇÃO DOS ARQUIVOS
# ============================================================

arquivos_criados = []

for questao in questoes:

    # Monta o nome do arquivo
    nome_arquivo = (
        f"a{codigo_aluno}"
        f"q{questao['questao']}"
        f"t{questao['tentativa']}.py"
    )

    # Cabeçalho
    cabecalho = f'''# Aluno: {nome_aluno} {matricula} ({codigo_aluno})
# Prova: {prova} ({codigo_prova})
# Questao: {int(questao["questao"])}, {int(questao["tentativa"])}a tentativa, nota: {questao["nota"]}
# Problema: {questao["problema"]} ({questao["codigo_problema"]})
# Turma(s): {turma}, semestre: {semestre}, e-mail: {email}
# Justificativa da nota: {questao["justificativa"]}

'''

    # Junta cabeçalho + código
    conteudo = cabecalho + questao["codigo"].strip() + "\n"

    # Cria o arquivo .py
    with open(nome_arquivo, "w", encoding="utf-8") as arquivo:
        arquivo.write(conteudo)

    arquivos_criados.append(nome_arquivo)


# ============================================================
# CRIAÇÃO DO ZIP
# ============================================================

with zipfile.ZipFile(nome_zip, "w", zipfile.ZIP_DEFLATED) as zipf:

    for arquivo in arquivos_criados:
        zipf.write(arquivo)

print("========================================")
print("Arquivos criados:")
print("========================================")

for arquivo in arquivos_criados:
    print("-", arquivo)

print("\n========================================")
print(f"Arquivo ZIP criado: {nome_zip}")
print("========================================")


# ============================================================
# OPCIONAL: APAGAR OS .PY DEPOIS DE CRIAR O ZIP
# ============================================================
# Se quiser manter os arquivos .py, deixe comentado.
# Se quiser apagar os .py e deixar somente o ZIP, remova o #.

# for arquivo in arquivos_criados:
#     os.remove(arquivo)