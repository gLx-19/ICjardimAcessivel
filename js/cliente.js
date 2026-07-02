const formCadastroUsuario = document.getElementById("formCadastroUsuario");

formCadastroUsuario.addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const dadosUsuario = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim().replace(/\D/g, ""), // Remove pontos e traços se o usuário digitar
        senha: document.getElementById("senha").value.trim()
    };

    try {
        const resposta = await fetch("http://localhost:8080/api/pessoas", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (resposta.ok) {
            alert("✅ Conta criada com sucesso! Agora você já pode fazer o seu login.");
            window.location.href = "login.html";
        } else {
            alert("❌ Erro ao criar conta. Verifique se este CPF já está cadastrado.");
        }

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert("🔌 Erro de conexão! Verifique se o servidor backend (Java) está rodando.");
    }
});