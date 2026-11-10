// Pega o ID da planta informado na URL
const urlParams = new URLSearchParams(window.location.search);
const idDaPlanta = urlParams.get("id");

// URL da API para buscar uma planta específica
const API_URL = `https://icjardimacessivel.onrender.com/api/plantas/${idDaPlanta}`;

// Configuração do vídeo em Libras (Canal ADEVITA-MG: https://www.youtube.com/@adevita_mg/videos)
// Para definir um vídeo específico por ID da planta futuramente, basta adicionar abaixo:
// Exemplo: 1: "https://www.youtube.com/watch?v=ID_DO_VIDEO"
const URL_PADRAO_LIBRAS = "https://www.youtube.com/@adevita_mg/videos";
const EMBED_PADRAO_ADEVITA = "https://www.youtube.com/embed/YF7M8lFVW-8?list=UUT542VZiJUddMIx3ddGPxJw";

const VIDEOS_LIBRAS_POR_PLANTA = {
    // 1: "https://www.youtube.com/watch?v=..."
};

let plantaCarregada = null;

function converterUrlYoutubeParaEmbed(url) {
    if (!url || typeof url !== "string") {
        return EMBED_PADRAO_ADEVITA;
    }

    const link = url.trim();
    if (link === "" || link.includes("@adevita_mg")) {
        return EMBED_PADRAO_ADEVITA;
    }

    if (link.includes("youtube.com/embed/")) {
        return link;
    }

    // Extrai ID de links do tipo youtube.com/watch?v=ID, youtu.be/ID ou youtube.com/shorts/ID
    const regexId = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regexId);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    return EMBED_PADRAO_ADEVITA;
}

function formatarCampoOpcional(valor) {
    if (valor === null || valor === undefined) {
        return "Informação não registrada";
    }
    const texto = String(valor).trim();
    if (texto === "" || texto.toLowerCase() === "null" || texto.toLowerCase() === "undefined") {
        return "Informação não registrada";
    }
    return texto;
}

// ======================================================
// 1. Busca as informações da planta no servidor
// ======================================================
async function carregarDetalhesInformacoes() {
    const mainElement = document.getElementById("conteudo-principal");
    if (mainElement) mainElement.setAttribute("aria-busy", "true");

    if (!idDaPlanta) {
        exibirMensagemErro();
        if (mainElement) mainElement.setAttribute("aria-busy", "false");
        return;
    }

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Planta inexistente.");
        }

        const planta = await resposta.json();
        plantaCarregada = planta;

        const imgEl = document.getElementById("imagemPlanta");
        if (imgEl) {
            const possuiImagemReal = Boolean(planta.imagemUrl && planta.imagemUrl.trim() !== "");
            imgEl.src = possuiImagemReal ? planta.imagemUrl : "imagens/logo.png";
            imgEl.alt = possuiImagemReal
                ? `Foto da planta ${planta.nome || ""}`.trim()
                : "";
        }

        document.getElementById("nomePlanta").innerText =
            formatarCampoOpcional(planta.nome);

        document.getElementById("nomeCientifico").innerText =
            formatarCampoOpcional(planta.nomeCientifico);

        document.getElementById("descricaoPlanta").innerText =
            formatarCampoOpcional(planta.descricao);

        document.getElementById("rega").innerText =
            formatarCampoOpcional(planta.rega);

        document.getElementById("poda").innerText =
            formatarCampoOpcional(planta.poda);

        document.getElementById("luminosidade").innerText =
            formatarCampoOpcional(planta.luminosidade);

        document.getElementById("familia").innerText =
            formatarCampoOpcional(planta.familia);

        // Atualiza o player de vídeo em Libras (usa o vídeo da planta se existir, ou o padrão da ADEVITA-MG)
        configurarVideoLibras(planta);

        // Atualiza o título da página com o nome da planta para leitores de tela
        if (planta.nome) {
            document.title = `${planta.nome} - Plantae Acessível`;
        }

        // 1. Ajusta o botão de voltar para o catálogo do jardim correto
        const linkVoltarCatalogo = document.querySelector(".menu-nav a");
        if (linkVoltarCatalogo && planta.jardimId) {
            linkVoltarCatalogo.href = `catalogo.html?jardimId=${planta.jardimId}`;
        }

        // 2. Injeta o link de Painel de Gestão se for ADMIN ou JARDINEIRO
        const perfil = localStorage.getItem("perfil");
        if (perfil === "ADMIN" || perfil === "JARDINEIRO") {
            const nav = document.querySelector(".menu-nav");
            if (nav && !nav.querySelector('a[href="menuUsuario.html"]')) {
                const linkPainel = document.createElement("a");
                linkPainel.href = "menuUsuario.html";
                linkPainel.textContent = "Painel de Gestão";
                nav.appendChild(linkPainel);
            }
        }
    } catch (erro) {
        console.error("Erro:", erro);
        exibirMensagemErro();
    } finally {
        if (mainElement) mainElement.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 2. Audiodescrição via Web Speech API (TTS Nativo pt-BR)
// ======================================================
function configurarAudioDescricao() {
    const btnAudio = document.querySelector(".audioDescricao");
    if (!btnAudio) return;

    const textoInicialBotao = btnAudio.textContent.trim() || "Modo de Leitura";

    function atualizarBotaoAudio(falando) {
        btnAudio.setAttribute("aria-pressed", falando ? "true" : "false");
        btnAudio.textContent = falando ? "Parar Leitura" : textoInicialBotao;
    }

    btnAudio.addEventListener("click", () => {
        if (!("speechSynthesis" in window)) {
            alert("Seu navegador não suporta síntese de voz para audiodescrição.");
            return;
        }

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            atualizarBotaoAudio(false);
            return;
        }

        if (!plantaCarregada) return;

        const nome = formatarCampoOpcional(plantaCarregada.nome);
        const cientifico = formatarCampoOpcional(plantaCarregada.nomeCientifico);
        const descricao = formatarCampoOpcional(plantaCarregada.descricao);
        const rega = formatarCampoOpcional(plantaCarregada.rega);
        const poda = formatarCampoOpcional(plantaCarregada.poda);
        const luminosidade = formatarCampoOpcional(plantaCarregada.luminosidade);
        const familia = formatarCampoOpcional(plantaCarregada.familia);

        const roteiroLeitura =
            `Planta: ${nome}. ` +
            `Nome científico: ${cientifico}. ` +
            `Descrição: ${descricao}. ` +
            `Cuidados e características: ` +
            `Frequência de rega: ${rega}. ` +
            `Frequência de poda: ${poda}. ` +
            `Luminosidade: ${luminosidade}. ` +
            `Família botânica: ${familia}.`;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(roteiroLeitura);
        utterance.lang = "pt-BR";
        utterance.rate = 1.0;

        utterance.onend = () => {
            atualizarBotaoAudio(false);
        };

        utterance.onerror = () => {
            atualizarBotaoAudio(false);
        };

        atualizarBotaoAudio(true);
        window.speechSynthesis.speak(utterance);
    });

    window.addEventListener("beforeunload", () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    });
}

// ======================================================
// 3. Configuração do Player de Vídeo em Libras (YouTube)
// ======================================================
function configurarVideoLibras(planta) {
    const iframeLibras = document.getElementById("videoLibrasPlanta");
    if (!iframeLibras) return;

    const urlEscolhida =
        (planta && (planta.librasUrl || planta.videoLibrasUrl)) ||
        VIDEOS_LIBRAS_POR_PLANTA[idDaPlanta] ||
        URL_PADRAO_LIBRAS;

    const urlEmbed = converterUrlYoutubeParaEmbed(urlEscolhida);

    if (iframeLibras.src !== urlEmbed) {
        iframeLibras.src = urlEmbed;
    }

    if (planta && planta.nome) {
        iframeLibras.title = `Vídeo em Libras sobre a planta ${planta.nome}`;
    }
}

// ======================================================
// 4. Exibe mensagem de erro
// ======================================================
function exibirMensagemErro() {
    const card = document.querySelector(".card");
    if (!card) return;

    card.innerHTML = `
        <div class="nomes">
            <h2>Planta não encontrada</h2>
            <p>Não foi possível localizar as informações desta espécie.</p>
        </div>
        <button type="button" class="btn-pesquisar" onclick="window.location.href='catalogo.html'">
            Voltar ao Catálogo
        </button>
    `;
}

// Inicialização
configurarAudioDescricao();
carregarDetalhesInformacoes();
