const API_TAGS = "http://localhost:8080/api/tags";
const API_PLANTAS = "http://localhost:8080/api/plantas";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaTagsDiv = document.getElementById("listaTags");
const selectPlanta = document.getElementById("planta");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Lista local para cruzarmos o ID da planta com o Nome na renderização
let listaPlantasLocal = [];
let tagEmEdicaoId = null;

// ======================================================
// 1. CARREGAR AS PLANTAS DO BANCO NO SELECT DE CADASTRO
// ======================================================
async function carregarSelectPlantas() {
    try {
        const resposta = await fetch(API_PLANTAS);
        if (!resposta.ok) throw new Error("Erro ao buscar plantas");
        
        listaPlantasLocal = await resposta.json();
        selectPlanta.innerHTML = "<option value=''>Selecione uma planta</option>"; 

        if (listaPlantasLocal.length === 0) {
            selectPlanta.innerHTML = "<option value=''>Nenhuma planta cadastrada</option>";
            return;
        }

        listaPlantasLocal.forEach(planta => {
            const option = document.createElement("option");
            option.value = planta.id; 
            option.textContent = planta.nome || "Planta sem nome";
            selectPlanta.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar select de plantas:", erro);
    }
}

// ======================================================
// 2. CARREGAR E FILTRAR A LISTA DE TAGS NFC
// ======================================================
async function carregarTags(termoPesquisa = "") {
    try {
        const resposta = await fetch(API_TAGS);
        if (!resposta.ok) throw new Error("Erro ao buscar tags");

        let tags = await resposta.json();
        listaTagsDiv.innerHTML = "";

        // Filtro local feito no front-end por código da Tag
        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase();
            tags = tags.filter(t => t.id && t.id.toLowerCase().includes(termo));
        }

        if (tags.length === 0) {
            listaTagsDiv.innerHTML = "<p>Nenhuma Tag NFC cadastrada.</p>";
            return;
        }

        tags.forEach(tag => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            // Encontra o nome da planta correspondente na nossa lista local
            const plantaCorrespondente = listaPlantasLocal.find(p => p.id === tag.plantaId);
            const nomePlanta = plantaCorrespondente ? (plantaCorrespondente.nome || "Sem nome") : "Nenhuma planta vinculada";

            itemDiv.innerHTML = `
                <span>
                    📱 ${tag.id} - ${nomePlanta}
                </span>
                <div class="acoes">
                    <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(tag).replace(/"/g, '&quot;')})">Editar</button>
                    <button class="btn-excluir" onclick="excluirTag('${tag.id}')">Excluir</button>
                </div>
            `;
            listaTagsDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar tags:", erro);
        listaTagsDiv.innerHTML = "<p style='color:red;'>Erro ao carregar dados do servidor.</p>";
    }
}

// ======================================================
// 3. PREPARAR EDIÇÃO (Puxa os dados de volta para a tela)
// ======================================================
function prepararEdicao(tag) {
    document.getElementById("codigo").value = tag.id || "";
    
    // Bloqueia o campo de ID (código nfc) na edição se for chave primária imutável
    document.getElementById("codigo").disabled = true;

    if (tag.plantaId) {
        selectPlanta.value = tag.plantaId;
    } else {
        selectPlanta.value = "";
    }

    tagEmEdicaoId = tag.id;
    btnSubmit.textContent = "💾 Salvar Alterações";
    
    formCadastro.scrollIntoView({ behavior: 'smooth' });
}

// ======================================================
// 4. CADASTRAR OU ATUALIZAR TAG NFC
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosTag = {
        id: document.getElementById("codigo").value.trim(),
        plantaId: selectPlanta.value ? parseInt(selectPlanta.value) : null,
        dataVinculo: null // O back-end tratará ou gerará automaticamente
    };

    try {
        let resposta;
        
        if (tagEmEdicaoId) {
            // Tentativa de Edição (Envia PUT)
            resposta = await fetch(`${API_TAGS}/${tagEmEdicaoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosTag)
            });
        } else {
            // Cadastro de nova Tag (Envia POST)
            resposta = await fetch(API_TAGS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosTag)
            });
        }

        if (resposta.ok) {
            alert(tagEmEdicaoId ? "✅ Vínculo da Tag atualizado!" : "✅ Tag NFC cadastrada com sucesso!");
            
            formCadastro.reset();
            document.getElementById("codigo").disabled = false;
            tagEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            
            carregarTags();
        } else {
            if (tagEmEdicaoId) {
                alert("⚠️ O Front-end enviou o PUT, mas sua dupla precisa criar a rota @PutMapping no TagController do Java.");
            } else {
                const erroTexto = await resposta.text();
                alert(`❌ Erro: ${erroTexto || "Verifique se a planta já possui tag ou se o código já existe."}`);
            }
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 5. EXCLUIR TAG NFC
// ======================================================
async function excluirTag(id) {
    if (!confirm(`Deseja mesmo remover a Tag ${id}?`)) return;

    try {
        const resposta = await fetch(`${API_TAGS}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("🗑️ Tag NFC removida com sucesso!");
            carregarTags();
        } else {
            alert("❌ Erro ao tentar excluir a tag.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

// ======================================================
// 6. FILTRO DE PESQUISA
// ======================================================
formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    const termo = document.getElementById("pesquisa").value;
    carregarTags(termo);
});

// Inicialização síncrona: carrega primeiro as plantas para que os nomes apareçam na listagem de tags
async function inicializar() {
    await carregarSelectPlantas();
    await carregarTags();
}

inicializar();