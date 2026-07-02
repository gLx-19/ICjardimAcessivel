const API_URL = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaJardinsDiv = document.getElementById("listaJardins");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

let jardimEmEdicaoId = null;

// ======================================================
// 1. CARREGAR E LISTAR JARDINS (COM FILTRO DE PESQUISA)
// ======================================================
async function carregarJardins(termoPesquisa = "") {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");

        let jardins = await resposta.json();
        listaJardinsDiv.innerHTML = "";

        // Filtro local feito no front-end por nome do jardim
        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase();
            jardins = jardins.filter(j => j.nome && j.nome.toLowerCase().includes(termo));
        }

        if (jardins.length === 0) {
            listaJardinsDiv.innerHTML = "<p>Nenhum jardim encontrado.</p>";
            return;
        }

        jardins.forEach(jardim => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            itemDiv.innerHTML = `
                <span>
                    🌳 <strong>${jardim.nome}</strong> - <small>${jardim.localizacao || 'Sem localização'}</small>
                </span>
                <div class="acoes">
                    <button class="btn-ver" onclick="alert('Descrição: ${jardim.descricao || "Sem descrição"}')">Ver</button>
                    <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(jardim).replace(/"/g, '&quot;')})">Editar</button>
                    <button class="btn-excluir" onclick="excluirJardim(${jardim.id})">Excluir</button>
                </div>
            `;
            listaJardinsDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar jardins:", erro);
        listaJardinsDiv.innerHTML = "<p style='color:red;'>Erro ao carregar dados do servidor. O Spring Boot está rodando?</p>";
    }
}

// ======================================================
// 2. PREPARAR EDIÇÃO (Puxa os dados para o formulário)
// ======================================================
function prepararEdicao(jardim) {
    document.getElementById("nome").value = jardim.nome || "";
    document.getElementById("localizacao").value = jardim.localizacao || "";
    document.getElementById("descricao").value = jardim.descricao || "";

    jardimEmEdicaoId = jardim.id;
    btnSubmit.textContent = "💾 Salvar Alterações";
    
    formCadastro.scrollIntoView({ behavior: 'smooth' });
}

// ======================================================
// 3. CADASTRAR OU ATUALIZAR JARDIM
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosJardim = {
        nome: document.getElementById("nome").value.trim(),
        localizacao: document.getElementById("localizacao").value.trim(),
        descricao: document.getElementById("descricao").value.trim()
    };

    try {
        let resposta;

        if (jardimEmEdicaoId) {
            // Se tem ID, atualiza (PUT)
            resposta = await fetch(`${API_URL}/${jardimEmEdicaoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosJardim)
            });
        } else {
            // Se não tem ID, cria um novo (POST)
            resposta = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosJardim)
            });
        }

        if (resposta.ok) {
            alert(jardimEmEdicaoId ? "✅ Jardim atualizado com sucesso!" : "✅ Jardim cadastrado com sucesso!");
            
            formCadastro.reset();
            jardimEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            
            carregarJardins();
        } else {
            const erroMensagem = await resposta.text();
            alert(`❌ Erro ao salvar: ${erroMensagem || "Verifique se o nome já existe ou os dados digitados."}`);
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 4. EXCLUIR JARDIM
// ======================================================
async function excluirJardim(id) {
    if (!confirm("Tem certeza que deseja apagar este jardim?")) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("🗑️ Jardim excluído com sucesso!");
            carregarJardins();
        } else {
            alert("❌ Erro ao tentar excluir o jardim. Pode haver plantas vinculadas a ele.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

// ======================================================
// 5. EVENTO DE PESQUISA
// ======================================================
formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    const termo = document.getElementById("pesquisa").value.trim();
    carregarJardins(termo);
});

// Inicializa a listagem ao entrar na página
carregarJardins();