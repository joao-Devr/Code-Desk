# 📚 Code Desk (CodeGrader)

**Code Desk** é uma bancada web de avaliação de código, pensada para professores corrigirem submissões de exercícios de programação. A ferramenta permite carregar um lote de submissões em `.zip`, visualizar o código de cada aluno lado a lado com o gabarito, registrar alertas/observações e consolidar uma nota final por questão.

> Projeto acadêmico em desenvolvimento, construído com Django.

---

## ✨ Funcionalidades

- **Autenticação de professores** — cadastro e login de conta , com sessão protegida.
- **Upload em lote de submissões** — envio de um único arquivo `.zip` com os arquivos de todos os alunos, processado em memória.
- **Parser automático de cabeçalho** — cada arquivo enviado é identificado pelo nome no padrão `a<id_curto>q<questão>t<tentativa>.<extensão>` (ex.: `a4020q02t01.py`) e por um cabeçalho em comentário no topo do arquivo, do qual o sistema extrai automaticamente: nome do aluno, matrícula, turma, e-mail, questão, tentativa, nota e justificativa.
- **Validações de segurança no upload** — checagem de extensão `.zip`, limite de tamanho do arquivo compactado (20 MB) e do conteúdo descompactado (50 MB), e limite máximo de arquivos por `.zip` (2000), para evitar uploads abusivos.
- **Navegação por aluno e por arquivo** — barra lateral com a lista de submissões extraídas do `.zip`, agrupadas por aluno e ordenadas por questão/tentativa.
- **Painel de comparação de código** — visualização lado a lado do código do aluno e do gabarito da questão.
- **Painel de análise** com abas para:
  - **Alertas** — observações automáticas sobre o código.
  - **Comandos Proibidos** — detecção de comandos/funções não permitidos no exercício.
  - **Histórico de Plágio** — comparação entre submissões para identificar similaridades suspeitas.
- **Painel de notas** — nota automática (Dredd, extraída do cabeçalho do arquivo) e nota manual do professor e campo de justificativa da correção.
- **Informações do estudante** — nome, matrícula, turma e nota atual exibidos na barra lateral.
- **Script utilitário de geração de massa de teste** (`Arquivos de teste/gerar_test.py`) — gera arquivos de submissão fictícios já no padrão de nome e cabeçalho esperado pelo sistema, e os empacota em um `.zip`, útil para testar o upload sem depender de dados reais de alunos.

---

## 🛠️ Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Backend | [Python 3.12+](https://www.python.org/) · [Django 6.0](https://www.djangoproject.com/) |
| Banco de dados | SQLite (`db.sqlite3`) |
| Frontend | HTML5, CSS3 e JavaScript |
| Autenticação | Sistema de usuários nativo do Django (`django.contrib.auth`) |

---

## 📁 Estrutura do projeto

```
Code-Desk/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── mysite/                 # Configurações do projeto Django (settings, urls, wsgi/asgi)
├── CodeDesk/                # App principal: upload/parser de zips, painel de correção
│   ├── views.py             # Parser de cabeçalho, validações e processamento do .zip
│   └── templates/CodeDesk.html
├── usuario/                  # App de autenticação: login, cadastro e logout
│   ├── views.py
│   └── templates/
├── staticfiles/               # CSS e JS servidos como estáticos
├── media/                      # Arquivos de mídia enviados/utilizados pela aplicação
└── Arquivos de teste/            # Script para gerar um .zip de submissões fictícias para teste
    └── gerar_test.py
```

---

## ✅ Pré-requisitos

- [Python 3.12 ou superior](https://www.python.org/downloads/)
- `pip` (geralmente já vem com o Python)
- Git (para clonar o repositório)

---

## 🚀 Como rodar o projeto localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/joao-Devr/Code-Desk.git
cd Code-Desk
```

### 2. Criar e ativar um ambiente virtual

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

### 3. Instalar as dependências

O repositório já inclui um `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 4. Aplicar as migrações do banco de dados

Válido tanto para Linux quanto para Windows (dentro do ambiente virtual ativado):

```bash
python manage.py migrate
```

### 5. Criar um superusuário (opcional, para acessar o `/admin`)

```bash
python manage.py createsuperuser
```

### 6. Rodar o servidor de desenvolvimento

```bash
python manage.py runserver
```

O projeto ficará disponível em:

```
http://127.0.0.1:8000/
```

- `/` — Login (`usuario`)
- `/cadastro/` — Cadastro de novo professor
- `/CodeDesk/` — Painel principal de correção (requer login)
- `/admin/` — Administração do Django

---

## 📦 Formato esperado do arquivo `.zip` de submissões

Cada arquivo dentro do `.zip` deve seguir o padrão de nome `a<id_curto>q<questão>t<tentativa>.<extensão>`, por exemplo `a4020q02t01.py`, e conter um cabeçalho em comentário no topo com os metadados do aluno e da submissão:

```
# Aluno: Nome do Estudante 20221234 (4735)
# Prova: Prova 3 - Quinta 15 (2669)
# Questao: 2, 1a tentativa, nota: 3
# Problema: Matrizes – Matriz Resultante de espaços vazios (1884)
# Turma(s): FP1 3A, semestre: 2026/1, e-mail: nome@dominio.edu
# Justificativa da nota: A quantidade de dados escritos pelo programa é diferente da quantidade de dados esperados.

<código do aluno>
```

Extensões suportadas: `.c`, `.h`, `.cpp`, `.hpp`, `.py`, `.java`, `.js`, `.ts`, `.txt`.

Para gerar rapidamente um `.zip` de teste nesse formato (com dados fictícios), use o script incluído no projeto:

```bash
cd "Arquivos de teste"
python gerar_test.py
```

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença [MIT](LICENSE).

---

## 👤 Autor

Desenvolvido por **João Pedro Campolina Rodrigues** ([@joao-Devr](https://github.com/joao-Devr)).
