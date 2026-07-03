const API_URL = "http://localhost:8080/api/plantas";
const API_JARDINS = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaPlantasDiv = document.getElementById("listaPlantas");
const selectJardim = document.getElementById("jardimSelect");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Captura a seção inteira do formulário para controlar a exibição (display: none/block)
const secaoCadastroPlanta = formCadastro.closest(".cadastro");
const btnAbrirCadastro = document.getElementById("btnAbrirCadastro"); // ID sugerido para o botão de "Cadastrar Nova Planta" no HTML

let plantaEmEdicaoId = null;

// Controla a abertura do formulário para uma NOVA planta
if (btnAbrirCadastro) {
    btnAbrirCadastro.addEventListener("click", () => {
        plantaEmEdicaoId = null;
        formCadastro.reset();
        btnSubmit.textContent = "Confirmar Cadastro";

        // Garante que o select do Jardim Único continue preenchido
        carregarSelectJardins();

        // Mostra o formulário na tela
        if (secaoCadastroPlanta) {
            secaoCadastroPlanta.style.display = "block";
            secaoCadastroPlanta.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Criamos um "dicionário" para o JavaScript lembrar o nome dos jardins
let mapaJardins = {};

// ======================================================
// 1. CARREGAR JARDINS (AGORA SALVA OS NOMES NO DICIONÁRIO)
// ======================================================
async function carregarSelectJardins() {
    try {
        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");
        const listaJardins = await resposta.json();

        selectJardim.innerHTML = "<option value=''>Selecione um jardim...</option>";
        mapaJardins = {}; // Limpa o dicionário

        if (!listaJardins || listaJardins.length === 0) {
            selectJardim.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        listaJardins.forEach(jardim => {
            mapaJardins[jardim.id] = jardim.nome; // Guarda o nome na memória

            const option = document.createElement("option");
            option.value = jardim.id;
            option.textContent = jardim.nome;
            selectJardim.appendChild(option);
        });

    } catch (erro) {
        console.error("Erro ao carregar select de jardins:", erro);
        selectJardim.innerHTML = "<option value=''>Erro ao carregar jardim</option>";
    }
}

// ======================================================
// 2. CARREGAR/LISTAR PLANTAS (COM VISUAL NOVO E NOME DO JARDIM)
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

            // Puxa o nome do jardim pela ID. Se não achar, mostra "Desconhecido"
            const nomeDoJardim = mapaJardins[planta.jardimId] || "Jardim Desconhecido";

            plantaCard.innerHTML = `
                <div style="display: flex; width: 100%; align-items: center; justify-content: space-between;">
                    
                    <div style="flex-grow: 1; padding-right: 20px;">
                        <strong>🌿 ${planta.nome || 'Sem nome'}</strong> 
                        <em>(${planta.nomeCientifico || 'Sem nome científico'})</em>
                        <br>
                        <small style="color: #198754; font-weight: bold;">📍 ${nomeDoJardim}</small>
                        <p style="margin-top: 5px; margin-bottom: 0;">${planta.descricao || 'Sem descrição.'}</p>
                    </div>

                    <div class="acoes" style="display: flex; gap: 8px; flex-shrink: 0;">
                        <button class="btn-ver" onclick="window.location.href='planta.html?id=${planta.id}'" style="background-color: #198754; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">👁️ Ver</button>
                        
                        <button class="btn-editar" onclick="prepararEdicao(${planta.id})" style="background-color: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">✏️ Editar</button>
                        
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
// 4. PREPARAR EDIÇÃO (MOSTRA O FORMULÁRIO APENAS AQUI)
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
            // Garante que o ID do jardim seja selecionado como texto para bater com as options geradas
            selectJardim.value = planta.jardimId.toString();
        }

        plantaEmEdicaoId = id;
        btnSubmit.textContent = "💾 Salvar Alterações";

        // Mostra o formulário de forma dinâmica ao clicar em Editar
        if (secaoCadastroPlanta) {
            secaoCadastroPlanta.style.display = "block";
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

    // Tratamento dos dados coletados para não mandar strings vazias em campos opcionais
    const dadosDaPlanta = {
        id: plantaEmEdicaoId ? plantaEmEdicaoId : null,
        nome: document.getElementById("nome").value.trim(),
        nomeCientifico: document.getElementById("cientifico").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        jardimId: parseInt(selectJardim.value),
        imagemUrl: document.getElementById("imagemUrl").value.trim() || null,

        // Garante envio correto de valores para propriedades que podem ser opcionais no banco
        familia: document.getElementById("familia").value.trim() || null,
        luminosidade: document.getElementById("luminosidade").value || null,
        rega: document.getElementById("rega").value.trim() || null,
        poda: document.getElementById("poda").value.trim() || null
    };

    try {
        let urlRequisicao = API_URL;
        let metodoRequisicao = "POST";

        // Se tiver ID de edição, muda a rota e o método para PUT
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
            alert(plantaEmEdicaoId ? "✅ Planta atualizada com sucesso!" : "✅ Planta cadastrada com sucesso!");
            formCadastro.reset();
            plantaEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";

            // Oculta novamente a seção do formulário após o sucesso do salvamento
            if (secaoCadastroPlanta) {
                secaoCadastroPlanta.style.display = "none";
            }

            await carregarSelectJardins();
            carregarPlantas();
        } else {
            alert("❌ Erro ao salvar. Verifique se as informações obrigatórias (Nome, Nome Científico e Descrição) estão preenchidas corretamente.");
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
    // Esconde o formulário logo no carregamento inicial da página por padrão
    if (secaoCadastroPlanta) {
        secaoCadastroPlanta.style.display = "none";
    }

    await carregarSelectJardins();
    
    // Deixa a lista aguardando a pesquisa do usuário
    listaPlantasDiv.innerHTML = "<p style='text-align:center; color:#555; padding: 20px;'>🔍 Utilize a barra de pesquisa acima para encontrar as plantas do catálogo.</p>";
}
inicializar();