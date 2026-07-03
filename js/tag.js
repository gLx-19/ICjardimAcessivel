const API_TAGS = "http://localhost:8080/api/tags";
const API_PLANTAS = "http://localhost:8080/api/plantas";
const API_JARDINS = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaTagsDiv = document.getElementById("listaTags");
const selectPlanta = document.getElementById("planta");
const selectJardimTag = document.getElementById("jardimTag");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Captura a seção inteira do formulário para controlar a exibição (display: none/block)
const secaoCadastroTag = formCadastro.closest(".cadastro");
const btnNovaTag = document.getElementById("btnNovaTag"); 

let listaPlantasLocal = [];
let tagEmEdicaoId = null;

// Controla a abertura do formulário para uma NOVA tag
if (btnNovaTag) {
    btnNovaTag.addEventListener("click", () => {
        tagEmEdicaoId = null;
        formCadastro.reset();
        document.getElementById("codigo").disabled = false;
        btnSubmit.textContent = "Confirmar Cadastro";
        
        // Inicializa preenchimentos automáticos
        carregarJardimCadastro();
        carregarSelectPlantas();
        
        if (secaoCadastroTag) {
            secaoCadastroTag.style.display = "block";
            secaoCadastroTag.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ======================================================
// 1. CARREGAR O JARDIM ÚNICO NO SELECT DE CADASTRO
// ======================================================
async function carregarJardimCadastro() {
    try {
        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardim");
        
        const jardimUnico = await resposta.json();
        selectJardimTag.innerHTML = "";

        if (!jardimUnico || !jardimUnico.id) {
            selectJardimTag.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        const option = document.createElement("option");
        option.value = jardimUnico.id;
        option.textContent = jardimUnico.nome;
        selectJardimTag.appendChild(option);
        selectJardimTag.value = jardimUnico.id;
    } catch (erro) {
        console.error("Erro ao carregar jardim no cadastro:", erro);
        selectJardimTag.innerHTML = "<option value=''>Erro ao carregar jardim</option>";
    }
}

// ======================================================
// 2. CARREGAR AS PLANTAS NO SELECT DE CADASTRO
// ======================================================
async function carregarSelectPlantas() {
    try {
        const resposta = await fetch(API_PLANTAS);
        if (!resposta.ok) throw new Error("Erro ao buscar plantas");
        
        listaPlantasLocal = await resposta.json();
        selectPlanta.innerHTML = "<option value=''>Selecione uma planta</option>"; 

        if (listaPlantasLocal.length === 0) {
            selectPlanta.innerHTML = "<option value=''>Nenhum planta cadastrada</option>";
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
// 3. CARREGAR E FILTRAR A LISTA DE TAGS NFC (SÓ EXIBE APÓS BUSCA)
// ======================================================
async function carregarTags(termoPesquisa = "") {
    try {
        if (!termoPesquisa.trim()) {
            listaTagsDiv.innerHTML = "<p>Utilize a barra de pesquisa acima para buscar as tags pelo código ou nome da planta.</p>";
            return;
        }

        const resposta = await fetch(API_TAGS);
        if (!resposta.ok) throw new Error("Erro ao buscar tags");

        let tags = await resposta.json();
        listaTagsDiv.innerHTML = "";

        const termo = termoPesquisa.toLowerCase().trim();

        // Filtro pelo Código NFC ou pelo Nome Popular da planta
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
// 4. PREPARAR EDIÇÃO (EXIBE FORMULÁRIO DINAMICAMENTE)
// ======================================================
async function prepararEdicao(tag) {
    document.getElementById("codigo").value = tag.id || "";
    document.getElementById("codigo").disabled = true;

    await carregarJardimCadastro();
    await carregarSelectPlantas();

    if (tag.plantaId) {
        selectPlanta.value = tag.plantaId;
    } else {
        selectPlanta.value = "";
    }

    tagEmEdicaoId = tag.id;
    btnSubmit.textContent = "💾 Salvar Alterações";
    
    if (secaoCadastroTag) {
        secaoCadastroTag.style.display = "block";
        secaoCadastroTag.scrollIntoView({ behavior: 'smooth' });
    }
}

// ======================================================
// 5. CADASTRAR OU ATUALIZAR TAG NFC
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
            
            // Oculta a área do formulário de novo após salvar
            if (secaoCadastroTag) {
                secaoCadastroTag.style.display = "none";
            }

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
// 6. EXCLUIR TAG NFC
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

formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    const termo = document.getElementById("pesquisa").value;
    carregarTags(termo);
});

// Inicialização segura
async function inicializar() {
    // Inicia ocultando o formulário por padrão
    if (secaoCadastroTag) {
        secaoCadastroTag.style.display = "none";
    }
    
    // Deixa carregada a lista de plantas local para otimizar os filtros de busca
    try {
        const resposta = await fetch(API_PLANTAS);
        if (resposta.ok) listaPlantasLocal = await resposta.json();
    } catch(e) { console.error(e); }

    listaTagsDiv.innerHTML = "<p>Utilize a barra de pesquisa acima para buscar as tags pelo código ou nome da planta.</p>";
}

inicializar();