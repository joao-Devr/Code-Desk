import zipfile

# ============================================================
# DADOS DA PROVA (comum a todos os alunos)
# ============================================================

prova = "Prova 3 - Quinta 15"
codigo_prova = "2669"

turma = "FP1 3A"
semestre = "2026/1"

# Nome do arquivo ZIP que será criado
nome_zip = "provas_alunos.zip"


# ============================================================
# QUESTÕES (mesmo padrão de questão para todos os alunos)
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
# ALUNOS DE EXEMPLO (15 alunos)
# ============================================================
# Para adicionar mais alunos, basta copiar um bloco abaixo.

alunos = [
    {"nome": "Douglas de Oliveira Silva",   "matricula": "20421234", "codigo_aluno": "4020", "email": "douglas.oliveira@estudante.ufla.br"},
    {"nome": "Ana Beatriz Souza Lima",      "matricula": "20421235", "codigo_aluno": "4021", "email": "ana.lima@estudante.ufla.br"},
    {"nome": "Carlos Eduardo Ferreira",     "matricula": "20421236", "codigo_aluno": "4022", "email": "carlos.ferreira@estudante.ufla.br"},
    {"nome": "Fernanda Costa Almeida",      "matricula": "20421237", "codigo_aluno": "4023", "email": "fernanda.almeida@estudante.ufla.br"},
    {"nome": "Gabriel Henrique Rocha",      "matricula": "20421238", "codigo_aluno": "4024", "email": "gabriel.rocha@estudante.ufla.br"},
    {"nome": "Isabela Martins Pereira",     "matricula": "20421239", "codigo_aluno": "4025", "email": "isabela.pereira@estudante.ufla.br"},
    {"nome": "João Pedro Nascimento",       "matricula": "20421240", "codigo_aluno": "4026", "email": "joao.nascimento@estudante.ufla.br"},
    {"nome": "Larissa Gomes Ribeiro",       "matricula": "20421241", "codigo_aluno": "4027", "email": "larissa.ribeiro@estudante.ufla.br"},
    {"nome": "Matheus Barbosa Cardoso",     "matricula": "20421242", "codigo_aluno": "4028", "email": "matheus.cardoso@estudante.ufla.br"},
    {"nome": "Natália Fernandes Dias",      "matricula": "20421243", "codigo_aluno": "4029", "email": "natalia.dias@estudante.ufla.br"},
    {"nome": "Otávio Ramos Teixeira",       "matricula": "20421244", "codigo_aluno": "4030", "email": "otavio.teixeira@estudante.ufla.br"},
    {"nome": "Patrícia Alves Monteiro",     "matricula": "20421245", "codigo_aluno": "4031", "email": "patricia.monteiro@estudante.ufla.br"},
    {"nome": "Rafael Correia Batista",      "matricula": "20421246", "codigo_aluno": "4032", "email": "rafael.batista@estudante.ufla.br"},
    {"nome": "Sofia Cavalcante Moreira",    "matricula": "20421247", "codigo_aluno": "4033", "email": "sofia.moreira@estudante.ufla.br"},
    {"nome": "Thiago Melo Vasconcelos",     "matricula": "20421248", "codigo_aluno": "4034", "email": "thiago.vasconcelos@estudante.ufla.br"},
]


# ============================================================
# CRIAÇÃO DO ZIP (direto na memória, sem gerar .py na pasta)
# ============================================================

arquivos_criados = []

with zipfile.ZipFile(nome_zip, "w", zipfile.ZIP_DEFLATED) as zipf:

    for aluno in alunos:
        for questao in questoes:

            # Monta o nome do arquivo
            nome_arquivo = (
                f"a{aluno['codigo_aluno']}"
                f"q{questao['questao']}"
                f"t{questao['tentativa']}.py"
            )

            # Cabeçalho
            cabecalho = f'''# Aluno: {aluno["nome"]} {aluno["matricula"]} ({aluno["codigo_aluno"]})
# Prova: {prova} ({codigo_prova})
# Questao: {int(questao["questao"])}, {int(questao["tentativa"])}a tentativa, nota: {questao["nota"]}
# Problema: {questao["problema"]} ({questao["codigo_problema"]})
# Turma(s): {turma}, semestre: {semestre}, e-mail: {aluno["email"]}
# Justificativa da nota: {questao["justificativa"]}

'''

            # Junta cabeçalho + código
            conteudo = cabecalho + questao["codigo"].strip() + "\n"

            # Escreve o conteúdo direto dentro do ZIP (sem criar .py em disco)
            zipf.writestr(nome_arquivo, conteudo)

            arquivos_criados.append(nome_arquivo)

print("========================================")
print("Arquivos adicionados ao ZIP:")
print("========================================")

for arquivo in arquivos_criados:
    print("-", arquivo)

print("\n========================================")
print(f"Arquivo ZIP criado: {nome_zip}")
print("========================================")
