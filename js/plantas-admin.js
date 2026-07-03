const API_URL = "http://localhost:8080/api/plantas";
const API_JARDINS = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaPlantasDiv = document.getElementById("listaPlantas");
const selectJardim = document.getElementById("jardimSelect");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

let plantaEmEdicaoId = null; 

// ======================================================
// 1. CARREGAR O JARDIM ÚNICO NO SELECT (CORRIGIDO)
// ======================================================
async function carregarSelectJardins() {
    try {
        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardim");
        
        // O back-end agora envia um objeto único, não um array []
        const jardimUnico = await resposta.json();
        selectJardim.innerHTML = "";

        if (!jardimUnico || !jardimUnico.id) {
            selectJardim.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        // Cria a opção única baseada no objeto recebido do Back-end
        const option = document.createElement("option");
        option.value = jardimUnico.id;
        option.textContent = jardimUnico.nome;
        selectJardim.appendChild(option);
        
        // Deixa ele selecionado por padrão
        selectJardim.value = jardimUnico.id;

    } catch (erro) {
        console.error("Erro ao carregar select de jardins:", erro);
        selectJardim.innerHTML = "<option value=''>Erro ao carregar jardim</option>";
    }
}

// ======================================================
// 2. CARREGAR/LISTAR PLANTAS
// ======================================================
async function carregarPlantas(termoPesquisa = "") {
    try {
        let url = API_URL;
        if (termoPesquisa) {
            url += `?pesquisa=${encodeURIComponent(termoPesquisa)}`;
        }

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao buscar plantas");

        const plantas = await resposta.json();
        listaPlantasDiv.innerHTML = "";

        if (plantas.length === 0) {
            listaPlantasDiv.innerHTML = "<p>Nenhuma planta encontrada.</p>";
            return;
        }

        plantas.forEach(planta => {
            const plantaCard = document.createElement("div");
            plantaCard.className = "planta-item"; 
            
            plantaCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>🌿 ${planta.nome || 'Sem nome'}</strong> 
                        <em>(${planta.nomeCientifico || 'Sem nome científico'})</em>
                        <p>${planta.descricao || 'Sem descrição.'}</p>
                    </div>
                    <div class="acoes">
                        <button class="btn-editar" onclick="prepararEdicao(${planta.id})" style="background-color: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-right: 5px;">✏️ Editar</button>
                        <button class="btn-excluir" onclick="excluirPlanta(${planta.id})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">🗑️ Excluir</button>
                    </div>
                </div>
                <hr style="border: 0; border-top: 1px solid #ccc; margin: 15px 0;">
            `;
            listaPlantasDiv.appendChild(plantaCard);
        });
    } catch (erro) {
        console.error("Erro ao carregar lista:", erro);
        listaPlantasDiv.innerHTML = "<p style='color:red;'>Erro ao carregar dados do servidor.</p>";
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
            alert("🗑️ Planta excluída com sucesso!");
            carregarPlantas();
        } else {
            alert("❌ Erro ao tentar excluir a planta.");
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

        if (document.getElementById("luminosidade") && planta.luminosidade) {
            document.getElementById("luminosidade").value = planta.luminosidade;
        }
        if (selectJardim && planta.jardimId) {
            selectJardim.value = planta.jardimId;
        }

        plantaEmEdicaoId = id;
        btnSubmit.textContent = "💾 Salvar Alterações";
        formCadastro.scrollIntoView({ behavior: 'smooth' });
    } catch (erro) {
        alert("Erro ao buscar os dados da planta para edição.");
    }
}

// ======================================================
// 5. CADASTRAR OU ATUALIZAR PLANTA (CORRIGIDO PARA O SEU CONTROLLER)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault(); 

    if (!selectJardim.value) {
        alert("Erro: É obrigatório selecionar o jardim de origem.");
        return;
    }

    const dadosDaPlanta = {
        id: plantaEmEdicaoId ? plantaEmEdicaoId : null, // Passa o ID se for edição para o Spring reaproveitar
        nome: document.getElementById("nome").value,
        nomeCientifico: document.getElementById("cientifico").value,
        familia: document.getElementById("familia").value,
        descricao: document.getElementById("descricao").value,
        luminosidade: document.getElementById("luminosidade").value,
        rega: document.getElementById("rega").value,
        poda: document.getElementById("poda").value,
        jardimId: parseInt(selectJardim.value)
    };

    try {
        // Como o seu PlantaController usa apenas o @PostMapping para salvar/atualizar
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosDaPlanta)
        });

        if (resposta.ok) {
            alert(plantaEmEdicaoId ? "✅ Planta atualizada com sucesso!" : "✅ Planta cadastrada com sucesso!");
            formCadastro.reset();
            plantaEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            
            // Garante que o select do Jardim permaneça preenchido corretamente
            await carregarSelectJardins();
            carregarPlantas();
        } else {
            alert("❌ Erro ao salvar. Verifique as informações ou se os campos obrigatórios estão corretos.");
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    carregarPlantas(document.getElementById("pesquisa").value);
});

// Inicialização segura das listas
async function inicializar() {
    await carregarSelectJardins();
    await carregarPlantas();
}
inicializar();