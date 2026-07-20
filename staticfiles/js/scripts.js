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