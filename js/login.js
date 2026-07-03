// Função chamada ao clicar no botão Login
async function autenticar() {
    // 1. Pega os valores digitados nos campos de CPF e Senha do seu login.html
    let cpfDigitado = document.getElementById("cpf").value.trim();
    const senhaDigitada = document.getElementById("senha").value.trim();

    // 2. Verifica se os campos estão vazios
    if (cpfDigitado === "" || senhaDigitada === "") {
        alert("⚠️ Por favor, preencha todos os campos.");
        return;
    }

    // 3. Monta o JSON exatamente como a rota do PessoaController espera receber (com a chave 'cpf')
    const credenciais = {
        cpf: cpfDigitado,
        senha: senhaDigitada
    };

    try {
        // 4. Faz a requisição POST para a rota do PessoaController no Java
        const resposta = await fetch("http://localhost:8080/api/pessoas/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credenciais)
        });

        // 5. Verifica se o Java validou o login com sucesso
        if (resposta.ok) {
            const usuarioDados = await resposta.json();

            // Salva no localStorage (Memória permanente do navegador)
            localStorage.setItem("usuarioLogado", "true");

            if (usuarioDados.nome) {
                localStorage.setItem("nomeUsuario", usuarioDados.nome);
            }

            // AQUI ESTÁ A MÁGICA PARA OS BOTÕES FUNCIONAREM:
            if (usuarioDados.perfil) {
                localStorage.setItem("perfil", usuarioDados.perfil);
            }

            alert(`✅ Login realizado com sucesso! Bem-vindo(a), ${usuarioDados.nome || "Usuário"}.`);

            // Redireciona para o menu principal do usuário
            window.location.href = "menuUsuario.html";

        } else {
            // Se o Java responder que a senha ou usuário estão errados (erro 401 ou 404)
            alert("❌ CPF ou senha incorretos. Verifique os dados.");
        }

    } catch (erro) {
        // Se o banco ou o Spring Boot estiverem desligados, vai cair aqui
        console.error("Erro de conexão com o servidor:", erro);
        alert("🔌 Erro de conexão com o servidor! O Spring Boot está rodando?");
    }
}