const API_MANUTENCOES = "http://localhost:8080/api/manutencoes";
const API_JARDINS = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaManutencoesDiv = document.getElementById("listaManutencoes");
const selectJardim = document.getElementById("jardim");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

let manutencaoEmEdicaoId = null;
let listaJardinsLocal = [];

// ======================================================
// 1. CARREGAR OS JARDINS REAIS NO SELECT
// ======================================================
async function carregarSelectJardins() {
    try {
        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");
        
        listaJardinsLocal = await resposta.json();
        selectJardim.innerHTML = "<option value=''>Selecione um jardim</option>"; 

        if (listaJardinsLocal.length === 0) {
            selectJardim.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        listaJardinsLocal.forEach(jardim => {
            const option = document.createElement("option");
            option.value = jardim.id; 
            option.textContent = jardim.nome || "Jardim sem nome";
            selectJardim.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar select de jardins:", erro);
    }
}

// ======================================================
// 2. LISTAR AS MANUTENÇÕES DO BANCO
// ======================================================
async function carregarManutencoes(termoPesquisa = "") {
    try {
        const resposta = await fetch(API_MANUTENCOES);
        if (!resposta.ok) throw new Error("Erro ao buscar manutenções");

        let manutencoes = await resposta.json();
        listaManutencoesDiv.innerHTML = "";

        // Filtro local adaptado para os campos reais do seu Java
        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase();
            manutencoes = manutencoes.filter(m => 
                (m.descricao && m.descricao.toLowerCase().includes(termo))
            );
        }

        if (manutencoes.length === 0) {
            listaManutencoesDiv.innerHTML = "<p>Nenhuma manutenção registrada.</p>";
            return;
        }

        manutencoes.forEach(manutencao => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            // Tratamento correto do campo dataRegistro vindo do Java DTO
            let dataFormatada = manutencao.dataRegistro;
            if (manutencao.dataRegistro && manutencao.dataRegistro.includes("-")) {
                const partes = manutencao.dataRegistro.split("-");
                dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            // Acha o nome do jardim correspondente para mostrar na tela
            const jardimObj = listaJardinsLocal.find(j => j.id === manutencao.jardimId);
            const nomeJardim = jardimObj ? jardimObj.nome : "Jardim não identificado";

            itemDiv.innerHTML = `
                <span>
                    🛠️ <strong>${nomeJardim}</strong> - (${dataFormatada || 'Sem data'})
                    <br><small style="color: #666;">Procedimento: ${manutencao.descricao}</small>
                </span>
                <div class="acoes">
                    <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(manutencao).replace(/"/g, '&quot;')})">Editar</button>
                    <button class="btn-excluir" onclick="excluirManutencao(${manutencao.id})">Excluir</button>
                </div>
            `;
            listaManutencoesDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar manutenções:", erro);
        listaManutencoesDiv.innerHTML = "<p style='color:red;'>Erro ao carregar dados do servidor.</p>";
    }
}

// ======================================================
// 3. PREPARAR EDIÇÃO
// ======================================================
function prepararEdicao(manutencao) {
    document.getElementById("data").value = manutencao.dataRegistro || "";
    document.getElementById("descricao").value = manutencao.descricao || "";
    
    if (manutencao.jardimId) {
        selectJardim.value = manutencao.jardimId;
    }

    manutencaoEmEdicaoId = manutencao.id;
    btnSubmit.textContent = "💾 Salvar Alterações";
    formCadastro.scrollIntoView({ behavior: 'smooth' });
}

// ======================================================
// 4. SALVAR OU ALTERAR (POST / PUT)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosManutencao = {
        dataRegistro: document.getElementById("data").value,
        descricao: document.getElementById("descricao").value.trim(),
        jardimId: parseInt(selectJardim.value)
    };

    try {
        let resposta;
        const url = manutencaoEmEdicaoId ? `${API_MANUTENCOES}/${manutencaoEmEdicaoId}` : API_MANUTENCOES;
        const metodo = manutencaoEmEdicaoId ? "PUT" : "POST";

        resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosManutencao)
        });

        if (resposta.ok) {
            alert(manutencaoEmEdicaoId ? "✅ Registro de manutenção alterado!" : "✅ Manutenção registrada com sucesso!");
            formCadastro.reset();
            manutencaoEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Registro";
            carregarManutencoes();
        } else {
            alert("❌ Erro ao processar dados no servidor. Verifique os campos.");
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 5. EXCLUIR
// ======================================================
async function excluirManutencao(id) {
    if (!confirm("Tem certeza que deseja apagar este registro de manutenção?")) return;

    try {
        const reply = await fetch(`${API_MANUTENCOES}/${id}`, { method: "DELETE" });
        if (reply.ok) {
            alert("🗑️ Registro de manutenção excluído!");
            carregarManutencoes();
        } else {
            alert("❌ Erro ao tentar excluir a manutenção.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    carregarManutencoes(document.getElementById("pesquisa").value.trim());
});

// Inicialização segura
async function inicializar() {
    await carregarSelectJardins();
    await carregarManutencoes();
}
inicializar();