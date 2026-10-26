document.addEventListener("DOMContentLoaded", async () => {
    // --------------------------------------------------------
    // 1. Lógica do Cabeçalho (Visitante vs Gestor)
    // --------------------------------------------------------
    const perfil = localStorage.getItem("perfil");
    const menuNav = document.getElementById("menuNavegacaoSuperior");

    if (menuNav) {
        if (perfil === "ADMIN" || perfil === "JARDINEIRO") {
            menuNav.hidden = false;
            menuNav.innerHTML = `<a href="menuUsuario.html">Painel de Gestão</a>`;
        } else {
            menuNav.hidden = true;
            menuNav.innerHTML = "";
        }
    }

    // --------------------------------------------------------
    // 2. Preencher a Caixa de Seleção de Jardins
    // --------------------------------------------------------
    const selectJardim = document.getElementById("selectJardimPublico");
    const mainContainer = document.getElementById("conteudo-principal");
    const mensagemErro = document.getElementById("mensagemErroJardim");

    function exibirErroAcessivel(texto) {
        if (mensagemErro) {
            mensagemErro.textContent = texto;
            mensagemErro.hidden = false;
        }
    }

    function limparErroAcessivel() {
        if (mensagemErro) {
            mensagemErro.textContent = "";
            mensagemErro.hidden = true;
        }
    }

    if (selectJardim) {
        selectJardim.addEventListener("change", limparErroAcessivel);

        try {
            if (mainContainer) mainContainer.setAttribute("aria-busy", "true");
            selectJardim.setAttribute("aria-busy", "true");

            const resposta = await fetch("https://icjardimacessivel.onrender.com/api/jardins");
            if (!resposta.ok) throw new Error("Erro ao buscar jardins");

            const jardins = await resposta.json();

            selectJardim.innerHTML = "<option value=''>Selecione um jardim...</option>";

            jardins.forEach(jardim => {
                const option = document.createElement("option");
                option.value = jardim.id;
                option.textContent = jardim.localizacao
                    ? `${jardim.nome} - ${jardim.localizacao}`
                    : jardim.nome;
                selectJardim.appendChild(option);
            });

            // Pré-seleciona automaticamente se houver apenas 1 jardim cadastrado (Ronda 1)
            if (jardins.length === 1) {
                selectJardim.value = String(jardins[0].id);
            }
        } catch (erro) {
            console.error("Erro:", erro);
            selectJardim.innerHTML = "<option value=''>Erro ao conectar ao servidor</option>";
            exibirErroAcessivel("Não foi possível carregar a lista de jardins. Verifique a conexão com a internet.");
        } finally {
            if (mainContainer) mainContainer.setAttribute("aria-busy", "false");
            selectJardim.setAttribute("aria-busy", "false");
        }
    }

    // --------------------------------------------------------
    // 3. O Clique no Botão "Iniciar Experiência"
    // --------------------------------------------------------
    const btnIniciar = document.getElementById("btnIniciarExperiencia");

    if (btnIniciar) {
        btnIniciar.addEventListener("click", () => {
            const idSelecionado = selectJardim ? selectJardim.value : "";

            if (!idSelecionado) {
                exibirErroAcessivel("Por favor, selecione um jardim na lista antes de iniciar a experiência.");
                if (selectJardim) selectJardim.focus();
                return;
            }

            limparErroAcessivel();
            window.location.href = `catalogo.html?jardimId=${idSelecionado}`;
        });
    }
});
