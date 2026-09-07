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

// Evento do botão Sobre
const btnSobre = document.getElementById('botao-sobre');
if (btnSobre) {
    btnSobre.addEventListener('click', () => abrirModal('sobre'));
}

// Eventos de fechar o modal
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


// ===== GERENCIAMENTO DE SUBMISSÕES E CÓDIGO =====
function escaparParaExibicao(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function ativarPastasDeAlunos() {
    document.querySelectorAll('.pasta-aluno').forEach(pasta => {
        pasta.addEventListener('click', () => {
            const grupo = pasta.closest('.grupo-aluno');
            if (grupo) {
                grupo.classList.toggle('aberto');
            }
        });
    });
}

function ativarSelecaoDeSubmissoes() {
    // 1. Carrega os gabaritos silenciosamente do HTML
    let gabaritos = {};
    const scriptGabaritos = document.getElementById('dados-gabaritos');
    if (scriptGabaritos) {
        gabaritos = JSON.parse(scriptGabaritos.textContent);
    }

    document.querySelectorAll('.item-submissao').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.item-submissao').forEach(i => i.classList.remove('ativo'));
            item.classList.add('ativo');

            // 2. Lê os dados
            const codigo = item.dataset.codigo || '';
            const questao = item.dataset.questao || '';
            const aluno = item.dataset.aluno || '';
            const matricula = item.dataset.matricula || '';
            const turma = item.dataset.turma || '';
            const notaAtual = item.dataset.notaAtual || '';
            const notaDredd = item.dataset.notaDredd || '';
            const justificativa = item.dataset.justificativa || '';
            const problema = item.dataset.problema || 'Problema não identificado';
            
            // 3. Renderiza CÓDIGO DO ALUNO
            const painelCodigo = document.getElementById('codigo-aluno');
            if (painelCodigo) {
                painelCodigo.innerHTML =
                    `<pre style="white-space: pre-wrap; margin: 0; font-family: inherit;">${escaparParaExibicao(codigo)}</pre>`;
            }

            // 4. Renderiza GABARITO (Busca no JSON pelo número da questão)
            const painelGabarito = document.getElementById('codigo-gabarito');
            if (painelGabarito) {
                const gabaritoCodigo = gabaritos[questao] || `// Gabarito não encontrado para a Questão ${questao}.`;
                painelGabarito.innerHTML = 
                    `<pre style="white-space: pre-wrap; margin: 0; font-family: inherit;">${escaparParaExibicao(gabaritoCodigo)}</pre>`;
            }

            // Atualiza Título
            const tituloProblema = document.getElementById('titulo-problema');
            if (tituloProblema) {
                tituloProblema.textContent = problema !== 'Problema não identificado' 
                                            ? `Problema: ${problema}` 
                                            : problema;
            }

            // Atualiza Sidebar
            const nomeUsuario = document.getElementById('nome-usuario');
            if (nomeUsuario) nomeUsuario.textContent = aluno;
            const matriculaUsuario = document.getElementById('matricula-usuario');
            if (matriculaUsuario) matriculaUsuario.textContent = matricula;
            const turmaUsuario = document.getElementById('turma-usuario');
            if (turmaUsuario) turmaUsuario.textContent = turma;
            const notaUsuario = document.getElementById('nota-usuario');
            if (notaUsuario) notaUsuario.textContent = notaAtual;

            // Preenche Notas
            const caixaNotaDredd = document.getElementById('caixa-nota-dredd');
            if (caixaNotaDredd) caixaNotaDredd.textContent = notaDredd || '—';
            const justificativaInput = document.getElementById('justificativa-correcao');
            if (justificativaInput) justificativaInput.value = justificativa;

            atualizarNotaFinal();
        });
    });
}


// ===== FUNCIONALIDADE DO PAINEL DE NOTAS =====
function atualizarNotaFinal() {
    const caixaNotaDredd = document.getElementById('caixa-nota-dredd');
    const notaManualInput = document.getElementById('nota-manual-input');
    const caixaNotaFinal = document.getElementById('caixa-nota-final');

    const notaDredd = parseFloat(caixaNotaDredd?.textContent) || 0;
    const notaManual = parseFloat(notaManualInput?.value);

    if (caixaNotaFinal) {
        caixaNotaFinal.textContent = isNaN(notaManual)
            ? notaDredd.toFixed(1)
            : ((notaDredd + notaManual) / 2).toFixed(1);
    }
}

// Recalcula a nota quando o professor digitar
document.getElementById('nota-manual-input')?.addEventListener('input', atualizarNotaFinal);

// Lógica de Salvar a Avaliação
const botaoSalvar = document.querySelector('.painel-notas .botao');
if (botaoSalvar) {
    botaoSalvar.addEventListener('click', () => {
        // Busca a submissão selecionada atualmente
        const submissaoAtiva = document.querySelector('.item-submissao.ativo');

        if (!submissaoAtiva) {
            alert('Selecione um arquivo de código antes de salvar.');
            return;
        }

        const idSubmissao = submissaoAtiva.dataset.idSubmissao;
        const notaManualInput = document.getElementById('nota-manual-input');
        const justificativaInput = document.getElementById('justificativa-correcao');

        const notaManual = parseFloat(notaManualInput?.value);
        const justificativa = justificativaInput?.value;

        if (isNaN(notaManual)) {
            alert('Por favor, preencha a nota manual com um valor numérico.');
            return;
        }

        console.log('Correção pronta para ser enviada ao backend:', {
            id_submissao: idSubmissao,
            nota_manual: notaManual,
            justificativa: justificativa
        });

        alert('Correção salva com sucesso!');
    });
}

// Inicializa a seleção de submissões ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    ativarSelecaoDeSubmissoes();
    ativarPastasDeAlunos();
});