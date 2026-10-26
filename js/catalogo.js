const divListaPlantas = document.getElementById('listaPlantas');
const inputPesquisa = document.getElementById('pesquisa');
const formPesquisa = document.getElementById('formPesquisa');
const statusPesquisa = document.getElementById('statusPesquisa');
const mainContainer = document.getElementById('conteudo-principal');

// URL da API Spring Boot
const API_URL = "https://icjardimacessivel.onrender.com/api/plantas";

function debounce(funcao, atrasoMs) {
    let temporizador;
    return function (...args) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => funcao.apply(this, args), atrasoMs);
    };
}

function anunciarParaLeitorDeTela(mensagem) {
    if (statusPesquisa) {
        statusPesquisa.textContent = mensagem;
    }
}

// ======================================================
// 1. CARREGAMENTO INICIAL DA PÁGINA (CABEÇALHO E RODAPÉ)
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {
    const perfil = localStorage.getItem("perfil");

    if (perfil === "ADMIN" || perfil === "JARDINEIRO") {
        const navCatalogo = document.getElementById("menuNavegacaoCatalogo");
        if (navCatalogo) {
            const linkGestao = document.createElement("a");
            linkGestao.href = "menuUsuario.html";
            linkGestao.textContent = "Painel de Gestão";
            navCatalogo.appendChild(linkGestao);
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const jardimId = urlParams.get("jardimId");

    if (jardimId) {
        try {
            const resposta = await fetch(`https://icjardimacessivel.onrender.com/api/jardins/${jardimId}`);
            if (resposta.ok) {
                const jardim = await resposta.json();

                const tituloEl = document.querySelector(".nomes h2");
                const descEl = document.querySelector(".nomes p");
                if (tituloEl && jardim.nome) tituloEl.innerText = jardim.nome;
                if (descEl && jardim.descricao) descEl.innerText = jardim.descricao;

                const rodapeParagrafo = document.querySelector(".footer-container p");
                if (rodapeParagrafo && jardim.nome) {
                    rodapeParagrafo.innerText = jardim.localizacao
                        ? `${jardim.nome} - ${jardim.localizacao}`
                        : jardim.nome;
                }
            }
        } catch (erro) {
            console.error("Erro ao buscar dados do jardim:", erro);
        }
    }
});

// ======================================================
// 2. BUSCA AS PLANTAS DO SERVIDOR E APLICA O FILTRO
// ======================================================
async function buscarPlantasDoServidor(termoPesquisa = "") {
    try {
        if (mainContainer) mainContainer.setAttribute("aria-busy", "true");
        if (divListaPlantas) divListaPlantas.setAttribute("aria-busy", "true");

        let url = API_URL;

        if (termoPesquisa.trim() !== "") {
            url += `?pesquisa=${encodeURIComponent(termoPesquisa.trim())}`;
        }

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar plantas.");
        }

        const plantas = await resposta.json();

        const urlParams = new URLSearchParams(window.location.search);
        const jardimIdUrl = urlParams.get("jardimId");

        let plantasParaMostrar = plantas;

        if (jardimIdUrl) {
            plantasParaMostrar = plantas.filter(p => p.jardimId == jardimIdUrl);
        }

        renderizarCatalogo(plantasParaMostrar);

    } catch (erro) {
        console.error("Erro:", erro);
        divListaPlantas.innerHTML = `<p class="mensagem-erro" role="alert">Não foi possível conectar ao servidor.</p>`;
        anunciarParaLeitorDeTela("Erro ao carregar plantas. Não foi possível conectar ao servidor.");
    } finally {
        if (mainContainer) mainContainer.setAttribute("aria-busy", "false");
        if (divListaPlantas) divListaPlantas.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 3. MOSTRA OS CARDS DAS PLANTAS NA TELA
// ======================================================
function renderizarCatalogo(plantas) {
    divListaPlantas.innerHTML = "";

    if (plantas.length === 0) {
        divListaPlantas.innerHTML = "<p class='mensagem-status'>Nenhuma planta encontrada para este jardim.</p>";
        anunciarParaLeitorDeTela("Nenhuma planta encontrada para este jardim.");
        return;
    }

    const total = plantas.length;
    anunciarParaLeitorDeTela(`${total} ${total === 1 ? "planta encontrada" : "plantas encontradas"}.`);

    plantas.forEach(planta => {
        const nomePlanta = planta.nome || "Planta sem identificação";
        const nomeCientifico = planta.nomeCientifico || "Nome científico não registrado";
        const possuiImagemReal = Boolean(planta.imagemUrl && planta.imagemUrl.trim() !== "");
        const urlImagem = possuiImagemReal ? planta.imagemUrl : "imagens/logo.png";
        const textoAlt = possuiImagemReal ? `Foto da planta ${nomePlanta}` : "";

        const cardArticle = document.createElement("article");
        cardArticle.className = "card-planta";

        cardArticle.innerHTML = `
            <img src="${urlImagem}" alt="${textoAlt}">
            <h3>${nomePlanta}</h3>
            <p><i>${nomeCientifico}</i></p>
            <button
                type="button"
                class="btn-pesquisar saberMais"
                onclick="verDetalhes(${planta.id})"
                aria-label="Saber mais sobre ${nomePlanta}"
            >
                Saber Mais
            </button>
        `;

        divListaPlantas.appendChild(cardArticle);
    });
}

// ======================================================
// 4. VAI PARA A PÁGINA DA PLANTA
// ======================================================
window.verDetalhes = function (id) {
    window.location.href = `planta.html?id=${id}`;
};

// ======================================================
// 5. EVENTOS DE PESQUISA (SUBMIT E DIGITAÇÃO COM DEBOUNCE)
// ======================================================
formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    buscarPlantasDoServidor(inputPesquisa.value);
});

const pesquisarComDebounce = debounce(function () {
    buscarPlantasDoServidor(inputPesquisa.value);
}, 500);

inputPesquisa.addEventListener("input", pesquisarComDebounce);

// ======================================================
// 6. CARREGAMENTO INICIAL DA LISTA
// ======================================================
buscarPlantasDoServidor();
