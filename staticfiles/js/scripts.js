// ===== GERENCIAMENTO DE MODALS =====
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

// Evento do botão Sobre (Único modal que sobrou na página)
const btnSobre = document.getElementById('botao-sobre');
if (btnSobre) {
    btnSobre.addEventListener('click', () => abrirModal('sobre'));
}

// Eventos de fechar o modal Sobre (clicando no 'X' ou no botão 'Entendi')
document.querySelectorAll('.fechar-modal').forEach(botao => {
    botao.addEventListener('click', (e) => {
        const nomeModal = e.target.getAttribute('data-modal');
        fecharModal(nomeModal);
    });
});

const btnFecharInstrucoes = document.getElementById('botao-fechar-instrucoes');
if (btnFecharInstrucoes) {
    btnFecharInstrucoes.addEventListener('click', () => {
        fecharModal('sobre');
    });
}

// Fechar modal ao clicar fora (no fundo escuro)
document.querySelectorAll('.overlay-modal').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            const nomeModal = overlay.id.replace('modal-', '');
            fecharModal(nomeModal);
        }
    });
});

// ===== GERENCIAMENTO DE ABAS =====
document.querySelectorAll('.aba').forEach(aba => {
    aba.addEventListener('click', () => {
        document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
        document.querySelectorAll('.conteudo-aba').forEach(c => c.classList.remove('visivel'));

        aba.classList.add('ativa');
        const nomeAba = aba.getAttribute('data-aba');
        const conteudoAba = document.getElementById(nomeAba);
        if (conteudoAba) {
            conteudoAba.classList.add('visivel');
        }
    });
});

// ===== GERENCIAMENTO DE SUBMISSÕES =====
document.querySelectorAll('.item-submissao').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.item-submissao').forEach(i => i.classList.remove('ativo'));
        item.classList.add('ativo');

        const idSubmissao = item.getAttribute('data-id-submissao');
        console.log('Submissão selecionada:', idSubmissao);
    });
});

// ===== FUNCIONALIDADE DO PAINEL DE NOTAS =====
const notaManualInput = document.getElementById('nota-manual-input');
const justificativaInput = document.getElementById('justificativa-correcao');
const botaoSalvar = document.querySelector('.painel-notas .botao');

if (notaManualInput) {
    notaManualInput.addEventListener('change', () => {
        const notaDredd = 10.0;
        const notaManual = parseFloat(notaManualInput.value) || 0;
        const notaFinal = (notaDredd + notaManual) / 2;

        const caixasNota = document.querySelectorAll('.painel-notas .caixa-notas');
        if (caixasNota.length >= 3) {
            caixasNota[2].textContent = notaFinal.toFixed(1);
        }
    });
}

if (botaoSalvar && notaManualInput && justificativaInput) {
    botaoSalvar.addEventListener('click', () => {
        const idSubmissao = 'sub-001';
        const notaManual = parseFloat(notaManualInput.value);
        const justificativa = justificativaInput.value;

        if (isNaN(notaManual)) {
            alert('Por favor, preencha a nota manual com um valor numérico');
            return;
        }

        console.log('Correção salva:', {
            id_submissao: idSubmissao,
            nota_manual: notaManual,
            justificativa: justificativa
        });

        alert('Correção salva com sucesso!');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os arquivos listados na barra lateral
    const itensSubmissao = document.querySelectorAll('.item-submissao');
    const areaCodigoAluno = document.getElementById('codigo-aluno');
    const nomeUsuarioPanel = document.getElementById('nome-usuario');

    itensSubmissao.forEach(item => {
        item.addEventListener('click', function() {
            
            // 1. Muda a cor de seleção (remove dos outros e coloca no clicado)
            itensSubmissao.forEach(i => i.classList.remove('ativo'));
            this.classList.add('ativo');

            // 2. Pega os dados que guardamos nos atributos data-*
            const codigo = this.getAttribute('data-codigo');
            const aluno = this.getAttribute('data-aluno');

            // 3. Atualiza o nome do aluno no painel "Informações do Estudante"
            if (nomeUsuarioPanel) {
                nomeUsuarioPanel.textContent = aluno;
            }

            // 4. Atualiza a tela preta de código no meio da página
            if (areaCodigoAluno) {
                // Limpa o código anterior
                areaCodigoAluno.innerHTML = '';
                
                // Quebra o código recebido em linhas para manter a estética do seu CSS
                const linhas = codigo.split('\n');
                
                linhas.forEach(linha => {
                    const divLinha = document.createElement('div');
                    divLinha.className = 'linha-codigo';
                    
                    // Usamos textContent para evitar injeção de HTML/XSS (muito seguro)
                    // e preservar a indentação original
                    divLinha.textContent = linha || ' '; 
                    
                    areaCodigoAluno.appendChild(divLinha);
                });
            }
        });
    });
});