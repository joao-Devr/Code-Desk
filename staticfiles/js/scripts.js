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
            const notaFinalAluno = item.dataset.notaFinalAluno || '—';
            const notaDredd = item.dataset.notaDredd || '';
            const justificativa = item.dataset.justificativa || '';
            const problema = item.dataset.problema || 'Problema não identificado';
            
            // 3. Renderiza e Colore o CÓDIGO DO ALUNO
            const painelCodigo = document.getElementById('codigo-aluno');
            if (painelCodigo) {
                // Insere o texto puro
                painelCodigo.textContent = codigo;
                // Remove a marcação de 'já colorido' para forçar o JS a pintar de novo
                delete painelCodigo.dataset.highlighted; 
                // Manda o Highlight.js agir neste elemento
                hljs.highlightElement(painelCodigo);
            }

            // 4. Renderiza e Colore o GABARITO
            const painelGabarito = document.getElementById('codigo-gabarito');
            if (painelGabarito) {
                const gabaritoCodigo = gabaritos[questao] || `// Gabarito não encontrado para a Questão ${questao}.`;
                // Insere o texto puro
                painelGabarito.textContent = gabaritoCodigo;
                // Remove a marcação para pintar de novo
                delete painelGabarito.dataset.highlighted;
                // Colore o gabarito
                hljs.highlightElement(painelGabarito);
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
            if (notaUsuario) notaUsuario.textContent = notaFinalAluno;

            // Preenche Notas e Justificativa
            const caixaNotaDredd = document.getElementById('caixa-nota-dredd');
            if (caixaNotaDredd) caixaNotaDredd.textContent = notaDredd || '—';
            
            // Busca a nota e justificativa que o professor digitou (ou deixa em branco)
            const notaFinalSalva = item.dataset.notaFinalPreenchida || '';
            const justificativaSalva = item.dataset.justificativaPreenchida || justificativa;

            const notaFinalInput = document.getElementById('nota-final-input');
            if (notaFinalInput) notaFinalInput.value = notaFinalSalva;

            const justificativaInput = document.getElementById('justificativa-correcao');
            if (justificativaInput) justificativaInput.value = justificativaSalva;

            atualizarNotaFinal();
        });
    });
}

// ===== FUNCIONALIDADE DO PAINEL DE NOTAS (SALVAMENTO TEMPORÁRIO) =====

// Salva a Nota Final digitada na barra lateral em tempo real
document.getElementById('nota-final-input')?.addEventListener('input', (e) => {
    const submissaoAtiva = document.querySelector('.item-submissao.ativo');
    if (submissaoAtiva) {
        submissaoAtiva.dataset.notaFinalPreenchida = e.target.value;
    }
});

// Salva a Justificativa digitada na barra lateral em tempo real
document.getElementById('justificativa-correcao')?.addEventListener('input', (e) => {
    const submissaoAtiva = document.querySelector('.item-submissao.ativo');
    if (submissaoAtiva) {
        submissaoAtiva.dataset.justificativaPreenchida = e.target.value;
    }
});

// Lógica de Enviar a Avaliação (Botão Salvar)
const botaoSalvar = document.querySelector('.painel-notas .botao');
if (botaoSalvar) {
    botaoSalvar.addEventListener('click', () => {
        const submissaoAtiva = document.querySelector('.item-submissao.ativo');

        if (!submissaoAtiva) {
            alert('Selecione um arquivo de código antes de salvar.');
            return;
        }

        const idSubmissao = submissaoAtiva.dataset.idSubmissao;
        const notaFinalInput = document.getElementById('nota-final-input');
        const justificativaInput = document.getElementById('justificativa-correcao');

        const notaFinal = parseFloat(notaFinalInput?.value);
        const justificativa = justificativaInput?.value;

        if (isNaN(notaFinal)) {
            alert('Por favor, preencha a Nota Final com um valor numérico.');
            return;
        }

        console.log('Correção pronta para ser enviada ao backend:', {
            id_submissao: idSubmissao,
            nota_final: notaFinal,
            justificativa: justificativa
        });

        alert('Correção salva com sucesso!');
    });
}

// ===== FUNCIONALIDADE DOS BOTÕES ANTERIOR E PRÓXIMO =====
function configurarBotoesNavegacao() {
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');

    if (!btnAnterior || !btnProximo) return;

    function navegarMesmaQuestao(direcao) {
        const itemAtivo = document.querySelector('.item-submissao.ativo');
        
        if (!itemAtivo) {
            alert("Selecione a questão de um aluno primeiro para começar a navegar.");
            return;
        }

        const questaoAtual = itemAtivo.dataset.questao;
        const itensMesmaQuestao = Array.from(document.querySelectorAll(`.item-submissao[data-questao="${questaoAtual}"]`));
        
        if (itensMesmaQuestao.length <= 1) {
            alert("Não há outros alunos com esta mesma questão.");
            return;
        }

        const indexAtual = itensMesmaQuestao.indexOf(itemAtivo);
        let novoIndex;

        if (direcao === 'proximo') {
            novoIndex = indexAtual + 1;
            if (novoIndex >= itensMesmaQuestao.length) {
                alert('Fim da lista! Você já corrigiu esta questão para todos os alunos.');
                return; 
            }
        } else if (direcao === 'anterior') {
            novoIndex = indexAtual - 1;
            if (novoIndex < 0) {
                alert('Este é o primeiro aluno da lista para esta questão.');
                return; 
            }
        }

        const novoItem = itensMesmaQuestao[novoIndex];

        const grupo = novoItem.closest('.grupo-aluno');
        if (grupo && !grupo.classList.contains('aberto')) {
            grupo.classList.add('aberto');
        }

        novoItem.click();
        novoItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    btnAnterior.addEventListener('click', () => navegarMesmaQuestao('anterior'));
    btnProximo.addEventListener('click', () => navegarMesmaQuestao('proximo'));
}

// ===== INICIALIZAÇÃO GERAL AO CARREGAR A PÁGINA =====
document.addEventListener('DOMContentLoaded', function () {
    ativarSelecaoDeSubmissoes();
    ativarPastasDeAlunos();
    configurarBotoesNavegacao();
}); 