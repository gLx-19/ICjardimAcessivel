// Função chamada ao clicar no botão Login
function autenticar() {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Verifica se os campos foram preenchidos
    if (email === "" || senha === "") {

        alert("Preencha todos os campos.");

        return;
    }

    // Simulação de login
    sessionStorage.setItem("usuarioLogado", "true");

    // Guarda o email (opcional)
    sessionStorage.setItem("emailUsuario", email);

    // Vai para o menu administrativo
    window.location.href = "menu.html";
}