const API_MANUTENCOES = "http://localhost:8080/api/manutencoes";
const API_JARDINS = "http://localhost:8080/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaManutencoesDiv = document.getElementById("listaManutencoes");
const selectJardim = document.getElementById("jardim");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Captura a seção inteira do formulário para controlar a exibição (display: none/block)
const secaoCadastroManutencao = formCadastro.closest(".cadastro");
const btnNovaManutencao = document.getElementById("btnNovaManutencao"); // Botão sugerido para o HTML

let manutencaoEmEdicaoId = null;
let jardimUnicoLocal = null;

// Controla a abertura do formulário para um NOVO registro
if (btnNovaManutencao) {
    btnNovaManutencao.addEventListener("click", () => {
        manutencaoEmEdicaoId = null;
        formCadastro.reset();
        btnSubmit.textContent = "Confirmar Registro";
        
        // Garante que o select do Jardim permaneça preenchido por padrão
        carregarSelectJardins();
        
        if (secaoCadastroManutencao) {
            secaoCadastroManutencao.style.display = "block";
            secaoCadastroManutencao.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ======================================================
// 1. CARREGAR O JARDIM REAL NO SELECT (OBJETO ÚNICO)
// ======================================================
async function carregarSelectJardins() {
    try {
        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardim");
        
        jardimUnicoLocal = await resposta.json();
        selectJardim.innerHTML = ""; 

        if (!jardimUnicoLocal || !jardimUnicoLocal.id) {
            selectJardim.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        const option = document.createElement("option");
        option.value = jardimUnicoLocal.id; 
        option.textContent = jardimUnicoLocal.nome || "Jardim Principal";
        selectJardim.appendChild(option);
        
        selectJardim.value = jardimUnicoLocal.id;
    } catch (erro) {
        console.error("Erro ao carregar select de jardim:", erro);
        selectJardim.innerHTML = "<option value=''>Erro ao carregar dados do jardim</option>";
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

        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase().trim();
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

            let dataFormatada = manutencao.dataRegistro;
            if (manutencao.dataRegistro && manutencao.dataRegistro.includes("-")) {
                const partes = manutencao.dataRegistro.split("-");
                dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            const nomeJardim = (jardimUnicoLocal && jardimUnicoLocal.id === manutencao.jardimId) 
                ? jardimUnicoLocal.nome 
                : "Jardim Cadastrado";

            itemDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span>
                        🛠️ <strong>${nomeJardim}</strong> - (${dataFormatada || 'Sem data'})
                        <br><small style="color: #666;">Procedimento: ${manutencao.descricao}</small>
                    </span>
                    <div class="acoes">
                        <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(manutencao).replace(/"/g, '&quot;')})" style="background-color: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-right: 5px;">✏️ Editar</button>
                        <button class="btn-excluir" onclick="excluirManutencao(${manutencao.id})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">🗑️ Excluir</button>
                    </div>
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
// 3. PREPARAR EDIÇÃO (EXIBE O FORMULÁRIO EXPLICITAMENTE)
// ======================================================
function prepararEdicao(manutencao) {
    document.getElementById("data").value = manutencao.dataRegistro || "";
    document.getElementById("descricao").value = manutencao.descricao || "";
    
    if (manutencao.jardimId) {
        selectJardim.value = manutencao.jardimId;
    }

    manutencaoEmEdicaoId = manutencao.id;
    btnSubmit.textContent = "💾 Salvar Alterações";
    
    // Mostra a seção de cadastro de manutenção dinamicamente
    if (secaoCadastroManutencao) {
        secaoCadastroManutencao.style.display = "block";
        secaoCadastroManutencao.scrollIntoView({ behavior: 'smooth' });
    }
}

// ======================================================
// 4. SALVAR OU ALTERAR (POST / PUT)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!selectJardim.value) {
        alert("Erro: É obrigatório associar a manutenção a um jardim de origem.");
        return;
    }

    const dadosManutencao = {
        id: manutencaoEmEdicaoId ? manutencaoEmEdicaoId : null,
        dataRegistro: document.getElementById("data").value,
        descricao: document.getElementById("descricao").value.trim(),
        jardimId: parseInt(selectJardim.value)
    };

    try {
        const url = manutencaoEmEdicaoId ? `${API_MANUTENCOES}/${manutencaoEmEdicaoId}` : API_MANUTENCOES;
        const metodo = manutencaoEmEdicaoId ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosManutencao)
        });

        if (resposta.ok) {
            alert(manutencaoEmEdicaoId ? "✅ Registro de manutenção alterado!" : "✅ Manutenção registrada com sucesso!");
            formCadastro.reset();
            manutencaoEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Registro";
            
            // Oculta a área de formulário de novo após salvar
            if (secaoCadastroManutencao) {
                secaoCadastroManutencao.style.display = "none";
            }
            
            await carregarSelectJardins();
            carregarManutencoes();
        } else {
            alert("❌ Erro ao processar dados no servidor. Verifique se as informações estão preenchidas corretamente.");
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

// Inicialização sequencial segura
async function inicializar() {
    // Garante ocultação padrão no primeiro carregamento
    if (secaoCadastroManutencao) {
        secaoCadastroManutencao.style.display = "none";
    }
    await carregarSelectJardins();
    await carregarManutencoes();
}
inicializar();