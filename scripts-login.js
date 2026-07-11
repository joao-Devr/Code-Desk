// ===== GERENCIAMENTO DE MODALS (login / cadastro) =====
function abrirModal(nomeModal) {
    const modal = document.getElementById(`modal-${nomeModal}`);
    if (modal) {
        modal.classList.add('visivel');
        document.body.style.overflow = 'hidden';
    }
}

function fecharModal(nomeModal) {
    const modal = document.getElementById(`modal-${nomeModal}`);
    if (modal) {
        modal.classList.remove('visivel');
        document.body.style.overflow = 'auto';
    }
}


// Links de navegação entre modals (só registra se o elemento existir)
const linkCadastro = document.getElementById('link-cadastro');
if (linkCadastro) {
    linkCadastro.addEventListener('click', () => {
        fecharModal('entrar');
        abrirModal('cadastrar');
    });
}

const linkEntrar = document.getElementById('link-entrar');
if (linkEntrar) {
    linkEntrar.addEventListener('click', () => {
        fecharModal('cadastrar');
        abrirModal('entrar');
    });
}

// ===== TRATAMENTO DE FORMULÁRIOS =====
const formularioEntrar = document.getElementById('formulario-entrar');
if (formularioEntrar) {
    formularioEntrar.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email-entrar').value;
        const senha = document.getElementById('senha-entrar').value;

        console.log('Login enviado:', { email, senha });
        // Aqui você faria uma requisição POST para seu backend em /api/autenticacao/entrar

        // Simulação
        alert('Formulário de login enviado!');
        fecharModal('entrar');
    });
}

const formularioCadastrar = document.getElementById('formulario-cadastrar');
if (formularioCadastrar) {
    formularioCadastrar.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome-cadastro').value;
        const email = document.getElementById('email-cadastro').value;
        const senha = document.getElementById('senha-cadastro').value;

        console.log('Cadastro enviado:', { nome, email, senha });
        // Aqui você faria uma requisição POST para seu backend em /api/autenticacao/registrar

        // Simulação
        alert('Formulário de cadastro enviado!');
        fecharModal('cadastrar');
    });
}