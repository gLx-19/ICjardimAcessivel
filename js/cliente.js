// Seleciona o formulário pelo ID
const formCadastroUsuario = document.getElementById("formCadastroUsuario");

// Escuta o evento de clique no botão de submit
formCadastroUsuario.addEventListener("submit", async function(event) {
    
    event.preventDefault(); // Impede a página de recarregar

    // Coleta os dados digitados nos inputs
    const dadosUsuario = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim()
    };

    try {
        // Envia para o backend (Java) na rota de Pessoa
        const resposta = await fetch("http://localhost:8080/api/pessoas", {
            method: "POST", // Método para criar
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });

        // Verifica a resposta do servidor
        if (resposta.ok) {
            alert("✅ Conta criada com sucesso! Agora você já pode fazer o seu login.");
            // Redireciona de volta para a tela de login para o usuário entrar
            window.location.href = "login.html";
        } else {
            alert("❌ Erro ao criar conta. Verifique se o CPF ou E-mail já estão cadastrados.");
        }

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert("🔌 Erro de conexão! Verifique se o servidor backend (Java) está rodando.");
    }
});