const API_URL = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const listaJardinsDiv = document.getElementById("listaJardins");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Como o jardim é único, guardamos os dados dele aqui
let jardimUnico = null;

// 1. CARREGAR O JARDIM ÚNICO DO SERVIDOR
async function carregarJardimUnico() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Erro ao buscar dados do jardim");

        // O back-end envia um objeto direto, e não uma lista []
        jardimUnico = await resposta.json();
        
        // Renderiza o jardim único na tela
        listaJardinsDiv.innerHTML = `
            <div class="planta-card">
                <div>
                    <strong>🌳 ${jardimUnico.nome}</strong> - <small>${jardimUnico.localizacao || 'Sem localização'}</small>
                    <p>${jardimUnico.descricao || 'Sem descrição.'}</p>
                </div>
                <div class="acoes">
                    <button class="btn-editar" onclick="prepararEdicao()">✏️ Editar Dados</button>
                </div>
            </div>
        `;

        // Salva o ID no localStorage para que a página de plantas saiba a quem se vincular!
        if (jardimUnico && jardimUnico.id) {
            localStorage.setItem("jardimPadraoId", jardimUnico.id);
        }

    } catch (erro) {
        console.error("Erro ao carregar jardim:", erro);
        listaJardinsDiv.innerHTML = "<p style='color:red;'>Erro ao carregar os dados do jardim no servidor.</p>";
    }
}

// 2. COLOCAR OS DADOS NO FORMULÁRIO PARA EDITAR
function prepararEdicao() {
    if (!jardimUnico) return;

    // Preenche os inputs do formulário com os dados atuais do jardim
    document.getElementById("nome").value = jardimUnico.nome;
    document.getElementById("localizacao").value = jardimUnico.localizacao || "";
    document.getElementById("descricao").value = jardimUnico.descricao || "";

    // Altera o título da seção de cadastro para fazer sentido visual
    const tituloCadastro = document.querySelector(".cadastro h3");
    if (tituloCadastro) tituloCadastro.innerText = "Editar Dados do Jardim";
    btnSubmit.innerText = "Salvar Alterações";
}

// 3. ENVIAR AS ATUALIZAÇÕES (SALVAR)
formCadastro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dadosAtualizados = {
        id: jardimUnico ? jardimUnico.id : null, // Envia o ID para manter o mesmo registro
        nome: document.getElementById("nome").value,
        localizacao: document.getElementById("localizacao").value,
        descricao: document.getElementById("descricao").value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
                // Se seu Spring Security já estiver ativo, descomente a linha abaixo:
                // "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!resposta.ok) throw new Error("Erro ao atualizar o jardim");

        alert("Dados do jardim atualizados com sucesso!");
        
        // Limpa o formulário e restaura o estado visual
        formCadastro.reset();
        const tituloCadastro = document.querySelector(".cadastro h3");
        if (tituloCadastro) tituloCadastro.innerText = "Cadastrar Novo Jardim";
        btnSubmit.innerText = "Confirmar Cadastro";

        // Recarrega os dados atualizados na tela
        carregarJardimUnico();

    } catch (erro) {
        console.error("Erro ao salvar jardim:", erro);
        alert("Falha ao salvar as alterações do jardim.");
    }
});

// Executa automaticamente ao carregar a página
document.addEventListener("DOMContentLoaded", carregarJardimUnico);