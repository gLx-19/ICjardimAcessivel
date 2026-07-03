const API_TAGS = "http://localhost:8080/api/tags";
const API_PLANTAS = "http://localhost:8080/api/plantas";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaTagsDiv = document.getElementById("listaTags");
const selectPlanta = document.getElementById("planta");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

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
// 2. CARREGAR E FILTRAR A LISTA DE TAGS NFC (SÓ EXIBE APÓS BUSCA)
// ======================================================
async function carregarTags(termoPesquisa = "") {
    try {
        // Se não houver termo digitado, limpa a área de listagem e não exibe nada por default
        if (!termoPesquisa.trim()) {
            listaTagsDiv.innerHTML = "<p>Utilize a barra de pesquisa acima para buscar as tags pelo código ou nome da planta.</p>";
            return;
        }

        const resposta = await fetch(API_TAGS);
        if (!resposta.ok) throw new Error("Erro ao buscar tags");

        let tags = await resposta.json();
        listaTagsDiv.innerHTML = "";

        const termo = termoPesquisa.toLowerCase().trim();

        // FILTRO EXPANDIDO: Filtra por Código NFC OU pelo Nome Popular da Planta vinculada
        tags = tags.filter(tag => {
            const codigoBate = tag.id && tag.id.toLowerCase().includes(termo);
            
            const plantaCorrespondente = listaPlantasLocal.find(p => p.id === tag.plantaId);
            const nomePlantaBate = plantaCorrespondente && 
                                   plantaCorrespondente.nome && 
                                   plantaCorrespondente.nome.toLowerCase().includes(termo);

            return codigoBate || nomePlantaBate;
        });

        if (tags.length === 0) {
            listaTagsDiv.innerHTML = "<p>Nenhuma Tag NFC encontrada para os critérios informados.</p>";
            return;
        }

        tags.forEach(tag => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            const plantaCorrespondente = listaPlantasLocal.find(p => p.id === tag.plantaId);
            const nomePlanta = plantaCorrespondente ? (plantaCorrespondente.nome || "Sem nome") : "Nenhuma planta vinculada";

            itemDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span>
                        📱 <strong>Código:</strong> ${tag.id} - 🌿 <strong>Planta:</strong> ${nomePlanta}
                    </span>
                    <div class="acoes">
                        <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(tag).replace(/"/g, '&quot;')})" style="background-color: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-right: 5px;">✏️ Editar</button>
                        <button class="btn-excluir" onclick="excluirTag('${tag.id}')" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">🗑️ Excluir</button>
                    </div>
                </div>
            `;
            listaTagsDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar tags:", erro);
        listaTagsDiv.innerHTML = "<p style='color:red;'>Erro ao processar dados no servidor.</p>";
    }
}

// ======================================================
// 3. PREPARAR EDIÇÃO
// ======================================================
function prepararEdicao(tag) {
    document.getElementById("codigo").value = tag.id || "";
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
        dataVinculo: null
    };

    try {
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
            alert(tagEmEdicaoId ? "✅ Vínculo da Tag atualizado!" : "✅ Tag NFC cadastrada com sucesso!");
            
            formCadastro.reset();
            document.getElementById("codigo").disabled = false;
            const termoPesquisadoAntigo = document.getElementById("pesquisa").value;
            tagEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            
            // Recarrega os dados com base no último termo pesquisado
            carregarTags(termoPesquisadoAntigo);
        } else {
            const erroTexto = await resposta.text();
            alert(`❌ Erro: ${erroTexto || "Verifique se a planta já possui tag ou se o código já existe."}`);
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
            document.getElementById("pesquisa").value = "";
            carregarTags("");
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

// Inicialização síncrona: Apenas carrega as plantas, a lista inicia limpa
async function inicializar() {
    await carregarSelectPlantas();
    // Mensagem orientativa inicial
    listaTagsDiv.innerHTML = "<p>Utilize a barra de pesquisa acima para buscar as tags pelo código ou nome da planta.</p>";
}

inicializar();