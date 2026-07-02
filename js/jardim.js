const API_URL = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaJardinsDiv = document.getElementById("listaJardins");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

let jardimEmEdicaoId = null;

// ======================================================\r
// 1. CARREGAR E LISTAR JARDINS (AGORA FILTRANDO NO BACK-END)\r
// ======================================================\r
async function carregarJardins(termoPesquisa = "") {
    try {
        let url = API_URL;
        
        // Se houver termo, anexa à requisição HTTP
        if (termoPesquisa.trim() !== "") {
            url += `?pesquisa=${encodeURIComponent(termoPesquisa)}`;
        }

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");

        const jardins = await resposta.json();
        listaJardinsDiv.innerHTML = "";

        if (jardins.length === 0) {
            listaJardinsDiv.innerHTML = "<p>Nenhum jardim encontrado.</p>";
            return;
        }

        jardins.forEach(jardim => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-card"; // Reutilizando a classe CSS de listagem antiga
            itemDiv.innerHTML = `
                <div>
                    <strong>${jardim.nome}</strong> - <small>${jardim.localizacao || 'Sem localização'}</small>
                    <p>${jardim.descricao || 'Sem descrição.'}</p>
                </div>
                <div class="acoes">
                    <button class="btn-editar" onclick="prepararEdicao(${jardim.id}, '${jardim.nome}', '${jardim.localizacao || ''}', '${jardim.descricao || ''}')">✏️ Editar</button>
                    <button class="btn-excluir" onclick="excluirJardim(${jardim.id})">🗑️ Excluir</button>
                </div>
            `;
            listaJardinsDiv.appendChild(itemDiv);
        });
    } catch (erro) {
        console.error("Erro ao carregar jardins:", erro);
        listaJardinsDiv.innerHTML = "<p style='color:red;'>Erro ao carregar a lista de jardins.</p>";
    }
}