// Pega o ID da planta informado na URL
const urlParams = new URLSearchParams(window.location.search);
const idDaPlanta = urlParams.get("id");

// URL da API para buscar uma planta específica
const API_URL = `http://localhost:8080/api/plantas/${idDaPlanta}`;

// ======================================================
// Busca as informações da planta no servidor
// ======================================================
async function carregarDetalhesInformacoes() {

    // Se não existir ID na URL
    if (!idDaPlanta) {
        exibirMensagemErro();
        return;
    }

    try {

        // Faz a requisição ao Spring Boot
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Planta inexistente.");
        }

        const planta = await resposta.json();

        // Preenche os dados na página
        document.getElementById("imagemPlanta").src =
            planta.imagemUrl || "imagens/placeholder.png";

        document.getElementById("imagemPlanta").alt =
            planta.nome;

        document.getElementById("nomePlanta").innerText =
            planta.nome;

        document.getElementById("nomeCientifico").innerText =
            planta.nomeCientifico;

        document.getElementById("descricaoPlanta").innerText =
            planta.descricao;

        document.getElementById("rega").innerText =
            planta.rega;

        document.getElementById("poda").innerText =
            planta.poda;

        document.getElementById("luminosidade").innerText =
            planta.luminosidade;

        document.getElementById("familia").innerText =
            planta.familia;

    } catch (erro) {

        console.error("Erro:", erro);

        exibirMensagemErro();

    }

}

// ======================================================
// Exibe mensagem de erro
// ======================================================
function exibirMensagemErro() {

    document.querySelector(".card").innerHTML = `
        <h2>Planta não encontrada!</h2>
        <br>
        <button class="btn-pesquisar"
            onclick="window.location.href='catalogo.html'">
            Voltar ao Catálogo
        </button>
    `;

}

// Carrega automaticamente ao abrir a página
carregarDetalhesInformacoes();