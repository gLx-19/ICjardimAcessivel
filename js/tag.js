const API_TAGS = "https://icjardimacessivel.onrender.com/api/tags";
const API_PLANTAS = "https://icjardimacessivel.onrender.com/api/plantas";
const API_JARDINS = "https://icjardimacessivel.onrender.com/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaTagsDiv = document.getElementById("listaTags");
const selectPlanta = document.getElementById("planta");
const selectJardimTag = document.getElementById("jardimTag");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

const secaoCadastroTag = formCadastro.closest(".cadastro");
const btnNovaTag = document.getElementById("btnNovaTag");

let listaPlantasLocal = [];
let tagEmEdicaoId = null;

if (btnNovaTag) {
    btnNovaTag.addEventListener("click", () => {
        tagEmEdicaoId = null;
        formCadastro.reset();
        document.getElementById("codigo").disabled = false;
        btnSubmit.textContent = "Confirmar Cadastro";

        carregarJardimCadastro();

        if (secaoCadastroTag) {
            secaoCadastroTag.hidden = false;
            secaoCadastroTag.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ======================================================
// 1. CARREGAR JARDINS (E BLOQUEAR PLANTAS INICIALMENTE)
// ======================================================
async function carregarJardimCadastro() {
    try {
        if (selectJardimTag) selectJardimTag.setAttribute("aria-busy", "true");

        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");

        const listaJardins = await resposta.json();

        selectJardimTag.innerHTML = "<option value=''>Selecione o Jardim...</option>";

        if (!listaJardins || listaJardins.length === 0) {
            selectJardimTag.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        listaJardins.forEach(jardim => {
            const option = document.createElement("option");
            option.value = jardim.id;
            option.textContent = jardim.nome;
            selectJardimTag.appendChild(option);
        });

        selectPlanta.innerHTML = "<option value=''>Selecione um jardim primeiro</option>";
        selectPlanta.disabled = true;

    } catch (erro) {
        console.error("Erro ao carregar jardim no cadastro:", erro);
    } finally {
        if (selectJardimTag) selectJardimTag.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 2. CASCATA: OUVIR A MUDANÇA DO JARDIM
// ======================================================
selectJardimTag.addEventListener("change", function (event) {
    const jardimSelecionado = event.target.value;
    carregarSelectPlantas(jardimSelecionado);
});

// ======================================================
// 3. PREENCHER PLANTAS COM BASE NO JARDIM ESCOLHIDO
// ======================================================
function carregarSelectPlantas(jardimId) {
    if (!jardimId) {
        selectPlanta.innerHTML = "<option value=''>Selecione um jardim primeiro</option>";
        selectPlanta.disabled = true;
        return;
    }

    selectPlanta.disabled = false;
    selectPlanta.innerHTML = "<option value=''>Selecione a planta...</option>";

    const plantasFiltradas = listaPlantasLocal.filter(p => p.jardimId == jardimId);

    if (plantasFiltradas.length === 0) {
        selectPlanta.innerHTML = "<option value=''>Nenhuma planta cadastrada neste jardim</option>";
        return;
    }

    plantasFiltradas.forEach(planta => {
        const option = document.createElement("option");
        option.value = planta.id;
        option.textContent = planta.nome || "Planta sem nome";
        selectPlanta.appendChild(option);
    });
}

// ======================================================
// 4. CARREGAR E FILTRAR A LISTA DE TAGS NFC
// ======================================================
async function carregarTags(termoPesquisa = "") {
    try {
        if (!termoPesquisa.trim()) {
            listaTagsDiv.innerHTML = "<p class='mensagem-status'>Utilize a barra de pesquisa acima para buscar as tags pelo código ou nome da planta.</p>";
            return;
        }

        if (listaTagsDiv) listaTagsDiv.setAttribute("aria-busy", "true");

        const resposta = await fetch(API_TAGS);
        if (!resposta.ok) throw new Error("Erro ao buscar tags");

        let tags = await resposta.json();
        listaTagsDiv.innerHTML = "";

        const termo = termoPesquisa.toLowerCase().trim();

        tags = tags.filter(tag => {
            const codigoBate = tag.id && tag.id.toLowerCase().includes(termo);
            const plantaCorrespondente = listaPlantasLocal.find(p => p.id === tag.plantaId);
            const nomePlantaBate = plantaCorrespondente &&
                plantaCorrespondente.nome &&
                plantaCorrespondente.nome.toLowerCase().includes(termo);

            return codigoBate || nomePlantaBate;
        });

        if (tags.length === 0) {
            listaTagsDiv.innerHTML = "<p class='mensagem-status'>Nenhuma Tag NFC encontrada para os critérios informados.</p>";
            return;
        }

        tags.forEach(tag => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            const plantaCorrespondente = listaPlantasLocal.find(p => p.id === tag.plantaId);
            const nomePlanta = plantaCorrespondente ? (plantaCorrespondente.nome || "Sem nome") : "Nenhuma planta vinculada";
            const dadosJson = JSON.stringify(tag).replace(/"/g, '&quot;');

            itemDiv.innerHTML = `
                <div class="item-conteudo">
                    <strong>Código:</strong> ${tag.id} - <strong>Planta:</strong> ${nomePlanta}
                </div>
                <div class="acoes">
                    <button type="button" class="btn-editar" onclick="prepararEdicao(${dadosJson})" aria-label="Editar tag ${tag.id}">Editar</button>
                    <button type="button" class="btn-excluir" onclick="excluirTag('${tag.id}')" aria-label="Excluir tag ${tag.id}">Excluir</button>
                </div>
            `;
            listaTagsDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar tags:", erro);
        listaTagsDiv.innerHTML = "<p class='mensagem-erro' role='alert'>Erro ao processar dados no servidor.</p>";
    } finally {
        if (listaTagsDiv) listaTagsDiv.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 5. PREPARAR EDIÇÃO
// ======================================================
async function prepararEdicao(tag) {
    document.getElementById("codigo").value = tag.id || "";
    document.getElementById("codigo").disabled = true;

    await carregarJardimCadastro();

    const plantaDaTag = listaPlantasLocal.find(p => p.id === tag.plantaId);
    if (plantaDaTag) {
        selectJardimTag.value = plantaDaTag.jardimId;
        carregarSelectPlantas(plantaDaTag.jardimId);
        selectPlanta.value = tag.plantaId;
    } else {
        selectJardimTag.value = "";
        selectPlanta.innerHTML = "<option value=''>Selecione um jardim primeiro</option>";
        selectPlanta.disabled = true;
    }

    tagEmEdicaoId = tag.id;
    btnSubmit.textContent = "Salvar Alterações";

    if (secaoCadastroTag) {
        secaoCadastroTag.hidden = false;
        secaoCadastroTag.scrollIntoView({ behavior: 'smooth' });
    }
}

// ======================================================
// 6. CADASTRAR OU ATUALIZAR TAG NFC
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosTag = {
        id: document.getElementById("codigo").value.trim(),
        plantaId: selectPlanta.value ? parseInt(selectPlanta.value) : null,
        dataVinculo: null
    };

    try {
        formCadastro.setAttribute("aria-busy", "true");
        let resposta;
        if (tagEmEdicaoId) {
            resposta = await fetch(`${API_TAGS}/${tagEmEdicaoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosTag)
            });
        } else {
            resposta = await fetch(API_TAGS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosTag)
            });
        }

        if (resposta.ok) {
            alert(tagEmEdicaoId ? "Vínculo da Tag atualizado com sucesso!" : "Tag NFC cadastrada com sucesso!");

            formCadastro.reset();
            document.getElementById("codigo").disabled = false;
            const termoPesquisadoAntigo = document.getElementById("pesquisa").value;
            tagEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";

            if (secaoCadastroTag) {
                secaoCadastroTag.hidden = true;
            }

            carregarTags(termoPesquisadoAntigo);
        } else {
            const erroTexto = await resposta.text();
            alert(`Erro: ${erroTexto || "Verifique se a planta já possui tag ou se o código já existe."}`);
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    } finally {
        formCadastro.setAttribute("aria-busy", "false");
    }
});

// ======================================================
// 7. EXCLUIR TAG NFC
// ======================================================
async function excluirTag(id) {
    if (!confirm(`Deseja mesmo remover a Tag ${id}?`)) return;

    try {
        const resposta = await fetch(`${API_TAGS}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("Tag NFC removida com sucesso!");
            document.getElementById("pesquisa").value = "";
            carregarTags("");
        } else {
            alert("Erro ao tentar excluir a tag.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    const termo = document.getElementById("pesquisa").value;
    carregarTags(termo);
});

// Inicialização segura
async function inicializar() {
    if (secaoCadastroTag) {
        secaoCadastroTag.hidden = true;
    }

    try {
        const resposta = await fetch(API_PLANTAS);
        if (resposta.ok) listaPlantasLocal = await resposta.json();
    } catch (e) {
        console.error(e);
    }

    listaTagsDiv.innerHTML = "<p class='mensagem-status'>Utilize a barra de pesquisa acima para buscar as tags pelo código ou nome da planta.</p>";
}

inicializar();
