const API_URL = "https://icjardimacessivel.onrender.com/api/plantas";
const API_JARDINS = "https://icjardimacessivel.onrender.com/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaPlantasDiv = document.getElementById("listaPlantas");
const selectJardim = document.getElementById("jardimSelect");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

const secaoCadastroPlanta = formCadastro.closest(".cadastro");
const btnAbrirCadastro = document.getElementById("btnAbrirCadastro");

let plantaEmEdicaoId = null;
let mapaJardins = {};

if (btnAbrirCadastro) {
    btnAbrirCadastro.addEventListener("click", () => {
        plantaEmEdicaoId = null;
        formCadastro.reset();
        btnSubmit.textContent = "Confirmar Cadastro";

        carregarSelectJardins();

        if (secaoCadastroPlanta) {
            secaoCadastroPlanta.hidden = false;
            secaoCadastroPlanta.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ======================================================
// 1. CARREGAR JARDINS (SALVA OS NOMES NO DICIONÁRIO)
// ======================================================
async function carregarSelectJardins() {
    try {
        if (selectJardim) selectJardim.setAttribute("aria-busy", "true");

        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");
        const listaJardins = await resposta.json();

        selectJardim.innerHTML = "<option value=''>Selecione um jardim...</option>";
        mapaJardins = {};

        if (!listaJardins || listaJardins.length === 0) {
            selectJardim.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        listaJardins.forEach(jardim => {
            mapaJardins[jardim.id] = jardim.nome;

            const option = document.createElement("option");
            option.value = jardim.id;
            option.textContent = jardim.nome;
            selectJardim.appendChild(option);
        });

    } catch (erro) {
        console.error("Erro ao carregar select de jardins:", erro);
        selectJardim.innerHTML = "<option value=''>Erro ao carregar jardim</option>";
    } finally {
        if (selectJardim) selectJardim.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 2. CARREGAR/LISTAR PLANTAS
// ======================================================
async function carregarPlantas(termoPesquisa = "") {
    try {
        if (listaPlantasDiv) listaPlantasDiv.setAttribute("aria-busy", "true");

        let url = API_URL;
        if (termoPesquisa) {
            url += `?pesquisa=${encodeURIComponent(termoPesquisa)}`;
        }

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao buscar plantas");

        const plantas = await resposta.json();
        listaPlantasDiv.innerHTML = "";

        if (plantas.length === 0) {
            listaPlantasDiv.innerHTML = "<p class='mensagem-status'>Nenhuma planta encontrada.</p>";
            return;
        }

        plantas.forEach(planta => {
            const plantaCard = document.createElement("div");
            plantaCard.className = "planta-item";

            const nomeDoJardim = mapaJardins[planta.jardimId] || "Jardim Desconhecido";
            const nomePlanta = planta.nome || "Sem nome";

            plantaCard.innerHTML = `
                <div class="item-conteudo">
                    <strong>${nomePlanta}</strong>
                    <em>(${planta.nomeCientifico || 'Sem nome científico'})</em>
                    <br>
                    <small class="item-localizacao">Jardim: ${nomeDoJardim}</small>
                    <p class="item-descricao">${planta.descricao || 'Sem descrição.'}</p>
                </div>

                <div class="acoes">
                    <button type="button" class="btn-ver" onclick="window.location.href='planta.html?id=${planta.id}'" aria-label="Ver detalhes de ${nomePlanta}">Ver</button>
                    <button type="button" class="btn-editar" onclick="prepararEdicao(${planta.id})" aria-label="Editar planta ${nomePlanta}">Editar</button>
                    <button type="button" class="btn-excluir" onclick="excluirPlanta(${planta.id})" aria-label="Excluir planta ${nomePlanta}">Excluir</button>
                </div>
            `;
            listaPlantasDiv.appendChild(plantaCard);
        });
    } catch (erro) {
        console.error("Erro ao carregar lista:", erro);
        listaPlantasDiv.innerHTML = "<p class='mensagem-erro' role='alert'>Erro ao carregar dados do servidor.</p>";
    } finally {
        if (listaPlantasDiv) listaPlantasDiv.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 3. EXCLUIR PLANTA
// ======================================================
async function excluirPlanta(id) {
    if (!confirm("Tem certeza que deseja apagar esta planta do catálogo?")) return;
    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("Planta excluída com sucesso!");
            carregarPlantas();
        } else {
            alert("Erro ao tentar excluir a planta.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

// ======================================================
// 4. PREPARAR EDIÇÃO
// ======================================================
async function prepararEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        if (!resposta.ok) throw new Error("Planta não encontrada");
        const planta = await resposta.json();

        document.getElementById("nome").value = planta.nome || "";
        document.getElementById("cientifico").value = planta.nomeCientifico || "";
        document.getElementById("familia").value = planta.familia || "";
        document.getElementById("descricao").value = planta.descricao || "";
        document.getElementById("rega").value = planta.rega || "";
        document.getElementById("poda").value = planta.poda || "";
        document.getElementById("imagemUrl").value = planta.imagemUrl || "";
        if (document.getElementById("luminosidade") && planta.luminosidade) {
            document.getElementById("luminosidade").value = planta.luminosidade;
        }
        if (selectJardim && planta.jardimId) {
            selectJardim.value = planta.jardimId.toString();
        }

        plantaEmEdicaoId = id;
        btnSubmit.textContent = "Salvar Alterações";

        if (secaoCadastroPlanta) {
            secaoCadastroPlanta.hidden = false;
            secaoCadastroPlanta.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (erro) {
        alert("Erro ao buscar os dados da planta para edição.");
    }
}

// ======================================================
// 5. CADASTRAR OU ATUALIZAR PLANTA
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!selectJardim.value) {
        alert("Erro: É obrigatório selecionar o jardim de origem.");
        return;
    }

    const dadosDaPlanta = {
        id: plantaEmEdicaoId ? plantaEmEdicaoId : null,
        nome: document.getElementById("nome").value.trim(),
        nomeCientifico: document.getElementById("cientifico").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        jardimId: parseInt(selectJardim.value),
        imagemUrl: document.getElementById("imagemUrl").value.trim() || null,
        familia: document.getElementById("familia").value.trim() || null,
        luminosidade: document.getElementById("luminosidade").value || null,
        rega: document.getElementById("rega").value.trim() || null,
        poda: document.getElementById("poda").value.trim() || null
    };

    try {
        formCadastro.setAttribute("aria-busy", "true");
        let urlRequisicao = API_URL;
        let metodoRequisicao = "POST";

        if (plantaEmEdicaoId) {
            urlRequisicao = `${API_URL}/${plantaEmEdicaoId}`;
            metodoRequisicao = "PUT";
        }

        const resposta = await fetch(urlRequisicao, {
            method: metodoRequisicao,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosDaPlanta)
        });

        if (resposta.ok) {
            alert(plantaEmEdicaoId ? "Planta atualizada com sucesso!" : "Planta cadastrada com sucesso!");
            formCadastro.reset();
            plantaEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";

            if (secaoCadastroPlanta) {
                secaoCadastroPlanta.hidden = true;
            }

            await carregarSelectJardins();
            carregarPlantas();
        } else {
            alert("Erro ao salvar. Verifique se as informações obrigatórias (Nome, Nome Científico e Descrição) estão preenchidas corretamente.");
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    } finally {
        formCadastro.setAttribute("aria-busy", "false");
    }
});

formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    carregarPlantas(document.getElementById("pesquisa").value);
});

// Inicialização segura das listas
async function inicializar() {
    if (secaoCadastroPlanta) {
        secaoCadastroPlanta.hidden = true;
    }

    await carregarSelectJardins();

    listaPlantasDiv.innerHTML = "<p class='mensagem-status'>Utilize a barra de pesquisa acima para encontrar as plantas do catálogo.</p>";
}
inicializar();
