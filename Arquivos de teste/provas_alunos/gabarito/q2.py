# Gabarito – Matriz Resultante de espaços vazios

linhas = int(input("Digite o número de linhas: "))
colunas = int(input("Digite o número de colunas: "))

matriz = []

for i in range(linhas):
    linha = []
    for j in range(colunas):
        valor = input(f"Digite o valor [{i}][{j}]: ")
        linha.append(valor)

    matriz.append(linha)

for linha in matriz:
    print(*linha)
