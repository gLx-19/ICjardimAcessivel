const API_URL = "http://localhost:8080/api/plantas";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaPlantasDiv = document.getElementById("listaPlantas");

// Pega o botão de submit do formulário para podermos mudar o texto dele depois
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Variável para guardar o ID da planta que estamos editando (se for null, significa que estamos cadastrando uma nova)
let plantaEmEdicaoId = null; 

// ======================================================
// 1. CARREGAR/LISTAR PLANTAS DO BANCO DE DADOS
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
            
            // Aqui estão os botões embaixo/do lado da planta!
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
        listaPlantasDiv.innerHTML = "<p style='color:red;'>Erro ao carregar plantas do servidor. O Spring Boot está rodando?</p>";
    }
}

// ======================================================
// 2. EXCLUIR PLANTA 
// ======================================================
async function excluirPlanta(id) {
    if (!confirm("Tem certeza que deseja apagar esta planta do catálogo?")) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("🗑️ Planta excluída com sucesso!");
            carregarPlantas(); // Atualiza a lista
        } else {
            alert("❌ Erro ao tentar excluir a planta.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

// ======================================================
// 3. PREPARAR EDIÇÃO (Puxa os dados para o formulário)
// ======================================================
async function prepararEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        if (!resposta.ok) throw new Error("Planta não encontrada");
        
        const planta = await resposta.json();

        // Preenche os campos do HTML com os dados da planta clicada
        document.getElementById("nome").value = planta.nome || "";
        document.getElementById("cientifico").value = planta.nomeCientifico || "";
        document.getElementById("familia").value = planta.familia || "";
        document.getElementById("descricao").value = planta.descricao || "";
        document.getElementById("rega").value = planta.rega || "";
        document.getElementById("poda").value = planta.poda || "";

        // Se tiver o select de luminosidade, tenta preencher também
        const luminosidadeSelect = document.getElementById("luminosidade");
        if (luminosidadeSelect && planta.luminosidade) luminosidadeSelect.value = planta.luminosidade;

        // Muda o estado da página para "Modo Edição"
        plantaEmEdicaoId = id;
        btnSubmit.textContent = "💾 Salvar Alterações";
        
        // Rola a tela suavemente para o formulário
        formCadastro.scrollIntoView({ behavior: 'smooth' });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao buscar os dados da planta para edição.");
    }
}

// ======================================================
// 4. CADASTRAR OU ATUALIZAR PLANTA (No mesmo formulário)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const dadosDaPlanta = {
        nome: document.getElementById("nome").value,
        nomeCientifico: document.getElementById("cientifico").value,
        familia: document.getElementById("familia").value,
        descricao: document.getElementById("descricao").value,
        luminosidade: document.getElementById("luminosidade").value,
        rega: document.getElementById("rega").value,
        poda: document.getElementById("poda").value,
        jardimId: 1 // O seu Java exige um JardimId para cadastrar, estou mandando 1 provisoriamente
    };

    try {
        let resposta;

        if (plantaEmEdicaoId) {
            // Se tem um ID na variável, é porque estamos EDITANDO (PUT)
            resposta = await fetch(`${API_URL}/${plantaEmEdicaoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosDaPlanta)
            });
        } else {
            // Se for null, estamos CADASTRANDO nova planta (POST)
            resposta = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosDaPlanta)
            });
        }

        if (resposta.ok) {
            alert(plantaEmEdicaoId ? "✅ Planta atualizada com sucesso!" : "✅ Planta cadastrada com sucesso!");
            
            // Limpa o formulário e volta o botão para o estado original
            formCadastro.reset();
            plantaEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            
            carregarPlantas(); // Atualiza a lista visual
        } else {
            alert("❌ Erro ao salvar. Verifique os dados.");
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 5. PESQUISA
// ======================================================
formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    const termo = document.getElementById("pesquisa").value;
    carregarPlantas(termo);
});

// Inicializa a lista ao abrir a tela
carregarPlantas();