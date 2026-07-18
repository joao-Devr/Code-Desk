
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

        // Eventos de botões para abrir modals
        document.getElementById('botao-entrar').addEventListener('click', () => abrirModal('entrar'));
        document.getElementById('botao-cadastrar').addEventListener('click', () => abrirModal('cadastrar'));
        document.getElementById('botao-sobre').addEventListener('click', () => abrirModal('sobre'));

        // Eventos de fechar modal
        document.querySelectorAll('.fechar-modal').forEach(botao => {
            botao.addEventListener('click', (e) => {
                const nomeModal = e.target.getAttribute('data-modal');
                fecharModal(nomeModal);
            });
        });

        // Fechar modal ao clicar fora
        document.querySelectorAll('.overlay-modal').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    const nomeModal = overlay.id.replace('modal-', '');
                    fecharModal(nomeModal);
                }
            });
        });

        // Links de navegação entre modals
        document.getElementById('link-cadastro').addEventListener('click', () => {
            fecharModal('entrar');
            abrirModal('cadastrar');
        });

        document.getElementById('link-entrar').addEventListener('click', () => {
            fecharModal('cadastrar');
            abrirModal('entrar');
        });

        document.getElementById('botao-fechar-instrucoes').addEventListener('click', () => {
            fecharModal('sobre');
        });

        // ===== GERENCIAMENTO DE ABAS =====
        document.querySelectorAll('.aba').forEach(aba => {
            aba.addEventListener('click', () => {
                // Remove classe ativa de todas as abas
                document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
                // Remove classe visível de todos os conteúdos
                document.querySelectorAll('.conteudo-aba').forEach(c => c.classList.remove('visivel'));

                // Adiciona classes ao elemento clicado e seu conteúdo
                aba.classList.add('ativa');
                const nomeAba = aba.getAttribute('data-aba');
                document.getElementById(nomeAba).classList.add('visivel');
            });
        });

        // ===== GERENCIAMENTO DE SUBMISSÕES =====
        document.querySelectorAll('.item-submissao').forEach(item => {
            item.addEventListener('click', () => {
                // Remove classe ativa de todos os itens
                document.querySelectorAll('.item-submissao').forEach(i => i.classList.remove('ativo'));
                // Adiciona classe ativa ao item clicado
                item.classList.add('ativo');

                const idSubmissao = item.getAttribute('data-id-submissao');
                console.log('Submissão selecionada:', idSubmissao);
                // Aqui você faria uma requisição para o backend para carregar os dados da submissão
            });
        });

        // ===== TRATAMENTO DE FORMULÁRIOS =====
        document.getElementById('formulario-entrar').addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email-entrar').value;
            const senha = document.getElementById('senha-entrar').value;

            console.log('Login enviado:', { email, senha });
            // Aqui você faria uma requisição POST para seu backend em /api/autenticacao/entrar

            // Simulação
            alert('Formulário de login enviado!');
            fecharModal('entrar');
        });

        document.getElementById('formulario-cadastrar').addEventListener('submit', (e) => {
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

        // ===== FUNCIONALIDADE DO PAINEL DE NOTAS =====
        const notaManualInput = document.getElementById('nota-manual-input');
        const justificativaInput = document.getElementById('justificativa-correcao');
        const botaoSalvar = document.querySelector('.painel-notas .botao');

        notaManualInput.addEventListener('change', () => {
            const notaDredd = 10.0;
            const notaManual = parseFloat(notaManualInput.value) || 0;
            const notaFinal = (notaDredd + notaManual) / 2;

            // Atualiza nota final dinamicamente
            document.querySelectorAll('.painel-notas .caixa-notas')[2].textContent = notaFinal.toFixed(1);
        });

        botaoSalvar.addEventListener('click', () => {
            const idSubmissao = 'sub-001'; // Você pegará isso do contexto
            const notaManual = parseFloat(notaManualInput.value);
            const justificativa = justificativaInput.value;

            if (isNaN(notaManual)) {
                alert('Por favor, preencha a nota manual com um valor numérico');
                return;
            }

            console.log('Correcção salva:', {
                id_submissao: idSubmissao,
                nota_manual: notaManual,
                justificativa: justificativa
            });

            // Aqui você faria uma requisição POST para seu backend em /api/submissoes/{id}/correcao
            alert('Correcção salva com sucesso!');
        });