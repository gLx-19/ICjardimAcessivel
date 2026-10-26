// Limpa qualquer sessão anterior ao abrir a tela de login para evitar que o
// smartphone de testes permaneça preso no perfil ADMIN/JARDINEIRO
document.addEventListener("DOMContentLoaded", () => {
    localStorage.clear();
});

// Função chamada ao clicar no botão Entrar
async function autenticar() {
    const formulario = document.getElementById("formulario");
    let cpfDigitado = document.getElementById("cpf").value.trim();
    const senhaDigitada = document.getElementById("senha").value.trim();

    if (cpfDigitado === "" || senhaDigitada === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const credenciais = {
        cpf: cpfDigitado,
        senha: senhaDigitada
    };

    try {
        if (formulario) formulario.setAttribute("aria-busy", "true");

        const resposta = await fetch("https://icjardimacessivel.onrender.com/api/pessoas/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credenciais)
        });

        if (resposta.ok) {
            const usuarioDados = await resposta.json();

            localStorage.setItem("usuarioLogado", "true");

            if (usuarioDados.nome) {
                localStorage.setItem("nomeUsuario", usuarioDados.nome);
            }

            if (usuarioDados.perfil) {
                localStorage.setItem("perfil", usuarioDados.perfil);
            }

            alert(`Login realizado com sucesso! Bem-vindo(a), ${usuarioDados.nome || "Usuário"}.`);
            window.location.href = "menuUsuario.html";

        } else {
            alert("CPF ou senha incorretos. Verifique os dados informados.");
        }

    } catch (erro) {
        console.error("Erro de conexão com o servidor:", erro);
        alert("Erro de conexão com o servidor. Verifique se o sistema está online.");
    } finally {
        if (formulario) formulario.setAttribute("aria-busy", "false");
    }
}
