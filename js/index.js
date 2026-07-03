document.addEventListener("DOMContentLoaded", async () => {
    
    // --------------------------------------------------------
    // 1. Lógica do Cabeçalho (Visitante vs Gestor)
    // --------------------------------------------------------
    const perfil = localStorage.getItem("perfil");
    const menuNav = document.getElementById("menuNavegacaoSuperior");

    if (menuNav) {
        if (perfil === "ADMIN" || perfil === "JARDINEIRO") {
            menuNav.innerHTML = `<a href="menuUsuario.html" style="color: white; text-decoration: none; font-weight: bold;">🏠 Painel de Gestão</a>`;
        } else {
            menuNav.innerHTML = `<a href="login.html" style="color: white; text-decoration: none; font-weight: bold;">🔐 Entrar</a>`;
        }
    }

    // --------------------------------------------------------
    // 2. Preencher a Caixa de Seleção de Jardins
    // --------------------------------------------------------
    const selectJardim = document.getElementById("selectJardimPublico");
    
    if (selectJardim) {
        try {
            // Vai ao Java buscar os jardins
            const resposta = await fetch("http://localhost:8080/api/jardins");
            if (!resposta.ok) throw new Error("Erro ao buscar jardins");
            
            const jardins = await resposta.json();
            
            // Limpa a opção de "A carregar..."
            selectJardim.innerHTML = "<option value=''>Selecione um jardim...</option>";
            
            // Adiciona cada jardim à lista
            jardins.forEach(jardim => {
                const option = document.createElement("option");
                option.value = jardim.id;
                // Exemplo: "Jardim do CEFET - Bloco B"
                option.textContent = `${jardim.nome} - ${jardim.localizacao || ''}`;
                selectJardim.appendChild(option);
            });

        } catch (erro) {
            console.error("Erro:", erro);
            selectJardim.innerHTML = "<option value=''>🔌 Erro ao ligar ao servidor</option>";
        }
    }

    // --------------------------------------------------------
    // 3. O Clique no Botão "Iniciar Experiência"
    // --------------------------------------------------------
    const btnIniciar = document.getElementById("btnIniciarExperiencia");
    
    if (btnIniciar) {
        btnIniciar.addEventListener("click", () => {
            const idSelecionado = selectJardim.value;
            
            // Proteção: Se a pessoa clicar sem escolher nada
            if (!idSelecionado) {
                alert("⚠️ Por favor, selecione um jardim na lista antes de iniciar a experiência!");
                return;
            }
            
            // Redireciona com o ID do jardim na URL!
            window.location.href = `catalogo.html?jardimId=${idSelecionado}`;
        });
    }
});