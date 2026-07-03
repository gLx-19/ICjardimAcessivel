const API_URL = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaJardinsDiv = document.getElementById("listaJardins");
const btnSubmit = formCadastro.querySelector("button[type='submit']");
const tituloFormulario = document.getElementById("tituloFormulario");

let jardimEmEdicaoId = null;

// ======================================================
// 1. CARREGAR E LISTAR JARDINS (COM FILTRO)
// ======================================================
async function carregarJardins(termoPesquisa = "") {
    try {
        let url = API_URL;
        
        // Se houver termo de busca, anexa na URL
        if (termoPesquisa.trim() !== "") {
            url += `?pesquisa=${encodeURIComponent(termoPesquisa)}`;
        }

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");

        const jardins = await resposta.json();
        listaJardinsDiv.innerHTML = "";

        if (!jardins || jardins.length === 0) {
            listaJardinsDiv.innerHTML = "<p>Nenhum jardim encontrado.</p>";
            return;
        }

        // Renderiza cada jardim retornado do back-end como um card com ações
        jardins.forEach(jardim => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-card"; 
            itemDiv.innerHTML = `
                <div>
                    <strong>🌳 ${jardim.nome}</strong> - <small>${jardim.localizacao || 'Sem localização'}</small>
                    <p>${jardim.descricao || 'Sem descrição.'}</p>
                </div>
                <div class="acoes">
                <button class="btn-ver" onclick="window.location.href='catalogo.html?jardimId=${jardim.id}'">👁️ Ver</button>
                    <button class="btn-editar" onclick="prepararEdicao(${jardim.id}, '${jardim.nome}', '${jardim.localizacao || ''}', '${jardim.descricao || ''}')">✏️ Editar</button>
                    <button class="btn-excluir" onclick="excluirJardim(${jardim.id})">🗑️ Excluir</button>
                </div>
            `;
            listaJardinsDiv.appendChild(itemDiv);
        });
    } catch (erro) {
        console.error("Erro ao carregar lista de jardins:", erro);
        listaJardinsDiv.innerHTML = "<p>🔌 Erro de conexão com o servidor ao listar jardins.</p>";
    }
}

// ======================================================
// 2. CADASTRO OU ATUALIZAÇÃO (POST / PUT)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosJardim = {
        nome: document.getElementById("nome").value,
        localizacao: document.getElementById("localizacao").value,
        descricao: document.getElementById("descricao").value
    };

    try {
        let url = API_URL;
        let metodo = "POST";

        // Se estiver editando, muda o método para PUT e insere o ID na URL ou no corpo
        if (jardimEmEdicaoId) {
            url = `${API_URL}/${jardimEmEdicaoId}`;
            metodo = "PUT";
            dadosJardim.id = jardimEmEdicaoId;
        }

        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosJardim)
        });

        if (resposta.ok) {
            alert(jardimEmEdicaoId ? "✅ Jardim atualizado com sucesso!" : "✅ Jardim cadastrado com sucesso!");
            
            // Reseta o estado do formulário
            formCadastro.reset();
            jardimEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            tituloFormulario.textContent = "Cadastrar Novo Jardim";
            
            // Recarrega a listagem limpa
            carregarJardins();
        } else {
            alert("❌ Erro ao salvar dados do jardim no servidor.");
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 3. PREPARAR EDIÇÃO (PREENCHE O FORMULÁRIO)
// ======================================================
function prepararEdicao(id, nome, localizacao, descricao) {
    jardimEmEdicaoId = id;
    document.getElementById("nome").value = nome;
    document.getElementById("localizacao").value = localizacao;
    document.getElementById("descricao").value = descricao;

    btnSubmit.textContent = "Salvar Alterações";
    tituloFormulario.textContent = "✏️ Editando Jardim";
    document.getElementById("secaoCadastroJardim").scrollIntoView({ behavior: 'smooth' });
}

// ======================================================
// 4. EXCLUSÃO DE JARDIM (DELETE)
// ======================================================
async function excluirJardim(id) {
    if (!confirm("Tem certeza que deseja apagar este jardim? Todas as plantas vinculadas a ele também podem ser afetadas.")) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("🗑️ Jardim excluído com sucesso!");
            carregarJardins();
        } else {
            alert("❌ Erro ao tentar excluir o jardim no back-end.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
        alert("🔌 Erro de conexão com o servidor!");
    }
}

// ======================================================
// 5. FILTRO DE PESQUISA (SUBMIT DO FORM)
// ======================================================
formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    const termo = document.getElementById("pesquisa").value.trim();
    carregarJardins(termo);
});

// Inicialização automática ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarJardins();
});