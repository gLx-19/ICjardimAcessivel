const divListaPlantas = document.getElementById('listaPlantas');
const inputPesquisa = document.getElementById('pesquisa');
const formPesquisa = document.getElementById('formPesquisa');

// URL da API Spring Boot
const API_URL = "https://icjardimacessivel.onrender.com/api/plantas";

// ======================================================
// 1. CARREGAMENTO INICIAL DA PÁGINA (CABEÇALHO E RODAPÉ)
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {
    
    // LÓGICA DO BOTÃO VOLTAR (ADMIN / JARDINEIRO)
    const perfil = localStorage.getItem("perfil"); 
    
    if (perfil === "ADMIN" || perfil === "JARDINEIRO") {
        const headerContainer = document.querySelector(".header-container");
        headerContainer.innerHTML += `
            <nav class="menu-nav">
                <a href="menuUsuario.html" style="color: white; text-decoration: none; font-weight: bold;">⬅ Voltar ao Painel de Gestão</a>
            </nav>
        `;
    }

    // LÓGICA DE PERSONALIZAÇÃO DO JARDIM
    const urlParams = new URLSearchParams(window.location.search);
    const jardimId = urlParams.get("jardimId");

    if (jardimId) {
        try {
            const resposta = await fetch(`https://icjardimacessivel.onrender.com/api/jardins/${jardimId}`);
            if (resposta.ok) {
                const jardim = await resposta.json();
                
                // Muda o Título e Subtítulo
                document.querySelector(".nomes h2").innerText = jardim.nome;
                document.querySelector(".nomes p").innerText = jardim.descricao;
                
                // Muda o Rodapé
                const rodapeParagrafo = document.querySelector(".footer-container p");
                rodapeParagrafo.innerText = `${jardim.nome} - ${jardim.localizacao}`;
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

        // --- O SEGREDO ESTÁ AQUI: O FILTRO DO JARDIM ---
        const urlParams = new URLSearchParams(window.location.search);
        const jardimIdUrl = urlParams.get("jardimId");

        let plantasParaMostrar = plantas;
        
        // Se a URL tiver um jardimId, filtra a lista para mostrar só as daquele jardim!
        if (jardimIdUrl) {
            plantasParaMostrar = plantas.filter(p => p.jardimId == jardimIdUrl);
        }
        // -------------------------------------------------

        renderizarCatalogo(plantasParaMostrar);

    } catch (erro) {
        console.error("Erro:", erro);
        divListaPlantas.innerHTML = `<p style="color:red;">Não foi possível conectar ao servidor.</p>`;
    }
}

// ======================================================
// 3. MOSTRA OS CARDS DAS PLANTAS NA TELA
// ======================================================
function renderizarCatalogo(plantas) {

    divListaPlantas.innerHTML = "";

    if (plantas.length === 0) {
        divListaPlantas.innerHTML = "<p>Nenhuma planta encontrada para este jardim.</p>";
        return;
    }

    plantas.forEach(planta => {
        const cardHTML = `
            <div class="planta-card">
                
                <img 
                    src="${planta.imagemUrl || 'imagens/placeholder.png'}" 
                    alt="${planta.nome || 'Planta'}" 
                    style="max-width:150px;border-radius:8px;"
                >

                <h3>${planta.nome || 'Sem nome'}</h3>

                <p><i>${planta.nomeCientifico || 'Sem nome científico'}</i></p>

                <button
                    class="btn-pesquisar"
                    onclick="verDetalhes(${planta.id})"
                    style="margin-top:10px;"
                >
                    Saber Mais
                </button>

            </div>
        `;

        divListaPlantas.innerHTML += cardHTML;
    });
}

// ======================================================
// 4. VAI PARA A PÁGINA DA PLANTA
// ======================================================
window.verDetalhes = function(id) {
    window.location.href = `planta.html?id=${id}`;
};

// ======================================================
// 5. EVENTOS DE PESQUISA (SUBMIT E DIGITAÇÃO)
// ======================================================
formPesquisa.addEventListener("submit", function(event){
    event.preventDefault();
    buscarPlantasDoServidor(inputPesquisa.value);
});

inputPesquisa.addEventListener("input", function(){
    buscarPlantasDoServidor(inputPesquisa.value);
});

// ======================================================
// 6. CARREGAMENTO INICIAL DA LISTA
// ======================================================
buscarPlantasDoServidor();