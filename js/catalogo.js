const divListaPlantas = document.getElementById('listaPlantas');
const inputPesquisa = document.getElementById('pesquisa');
const formPesquisa = document.getElementById('formPesquisa');

// URL da API Spring Boot
const API_URL = "http://localhost:8080/api/plantas";

// ======================================================
// Busca as plantas do servidor (Spring Boot)
// ======================================================
async function buscarPlantasDoServidor(termoPesquisa = "") {

    try {

        let url = API_URL;

        // Caso exista pesquisa
        if (termoPesquisa.trim() !== "") {
            url += `?pesquisa=${encodeURIComponent(termoPesquisa)}`;
        }

        divListaPlantas.innerHTML = "<p>Carregando plantas...</p>";

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar plantas.");
        }

        const plantas = await resposta.json();

        renderizarCatalogo(plantas);

    } catch (erro) {

        console.error("Erro:", erro);

        divListaPlantas.innerHTML =
            `<p style="color:red;">
                Não foi possível conectar ao servidor.
            </p>`;
    }

}

// ======================================================
// Mostra os cards das plantas
// ======================================================
function renderizarCatalogo(plantas) {

    divListaPlantas.innerHTML = '';

    if (plantas.length === 0) {

        divListaPlantas.innerHTML =
            "<p>Nenhuma planta encontrada.</p>";

        return;
    }

    plantas.forEach(planta => {

        const cardHTML = `
            <div class="card" style="margin-bottom:20px;padding:15px;text-align:center;">

                <img
                    src="${planta.imagemUrl || 'imagens/placeholder.png'}"
                    alt="${planta.nome}"
                    style="max-width:150px;border-radius:8px;">

                <h3>${planta.nome}</h3>

                <p><i>${planta.nomeCientifico}</i></p>

                <button
                    class="btn-pesquisar"
                    onclick="verDetalhes(${planta.id})"
                    style="margin-top:10px;">

                    Saber Mais

                </button>

            </div>
        `;

        divListaPlantas.innerHTML += cardHTML;

    });

}

// ======================================================
// Vai para a página da planta
// ======================================================
window.verDetalhes = function(id) {

    window.location.href = `planta.html?id=${id}`;

};

// ======================================================
// Pesquisa pelo botão do formulário
// ======================================================
formPesquisa.addEventListener("submit", function(event){

    event.preventDefault();

    buscarPlantasDoServidor(inputPesquisa.value);

});

// ======================================================
// Pesquisa enquanto digita
// ======================================================
inputPesquisa.addEventListener("input", function(){

    buscarPlantasDoServidor(inputPesquisa.value);

});

// ======================================================
// Carrega todas as plantas ao abrir a página
// ======================================================
buscarPlantasDoServidor();