# Aluno: Ana Beatriz Souza Lima 20421235 (4021)
# Prova: Prova 3 - Quinta 15 (2669)
# Questao: 2, 1a tentativa, nota: 3
# Problema: Matrizes – Matriz Resultante de espaços vazios (1884)
# Turma(s): FP1 3A, semestre: 2026/1, e-mail: ana.lima@estudante.ufla.br
# Justificativa da nota: A quantidade de dados escritos pelo programa é diferente da quantidade de dados esperados.

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

print("\nMatriz resultante:")

for linha in matriz:
    print(*linha)
