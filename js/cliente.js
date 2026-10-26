const formCadastroUsuario = document.getElementById("formCadastroUsuario");

formCadastroUsuario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosUsuario = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim().replace(/\D/g, ""),
        senha: document.getElementById("senha").value.trim()
    };

    try {
        formCadastroUsuario.setAttribute("aria-busy", "true");

        const resposta = await fetch("https://icjardimacessivel.onrender.com/api/pessoas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (resposta.ok) {
            alert("Conta criada com sucesso! Agora você já pode realizar o seu login.");
            window.location.href = "login.html";
        } else {
            alert("Erro ao criar conta. Verifique se este CPF já está cadastrado.");
        }

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert("Erro de conexão. Verifique se o servidor está online.");
    } finally {
        formCadastroUsuario.setAttribute("aria-busy", "false");
    }
});
