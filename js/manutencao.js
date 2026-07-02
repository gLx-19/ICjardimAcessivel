const API_MANUTENCOES = "http://localhost:8080/api/manutencoes";
const API_PLANTAS = "http://localhost:8080/api/plantas";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaManutencoesDiv = document.getElementById("listaManutencoes");
const selectPlanta = document.getElementById("planta");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Variável para controlar se estamos editando ou cadastrando
let manutencaoEmEdicaoId = null;

// ======================================================
// 1. CARREGAR AS PLANTAS DO BANCO NO SELECT DE CADASTRO
// ======================================================
async function carregarSelectPlantas() {
    try {
        const resposta = await fetch(API_PLANTAS);
        if (!resposta.ok) throw new Error("Erro ao buscar plantas");
        
        const plantas = await resposta.json();
        selectPlanta.innerHTML = ""; 

        if (plantas.length === 0) {
            selectPlanta.innerHTML = "<option value=''>Nenhuma planta cadastrada</option>";
            return;
        }

        plantas.forEach(planta => {
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
// 2. CARREGAR E FILTRAR A LISTA DE MANUTENÇÕES
// ======================================================
async function carregarManutencoes(termoPesquisa = "") {
    try {
        const resposta = await fetch(API_MANUTENCOES);
        if (!resposta.ok) throw new Error("Erro ao buscar manutenções");

        let manutencoes = await resposta.json();
        listaManutencoesDiv.innerHTML = "";

        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase();
            manutencoes = manutencoes.filter(m => 
                (m.tipo && m.tipo.toLowerCase().includes(termo)) ||
                (m.responsavel && m.responsavel.toLowerCase().includes(termo)) ||
                (m.descricao && m.descricao.toLowerCase().includes(termo)) ||
                (m.nomePlanta && m.nomePlanta.toLowerCase().includes(termo))
            );
        }

        if (manutencoes.length === 0) {
            listaManutencoesDiv.innerHTML = "<p>Nenhuma manutenção registrada.</p>";
            return;
        }

        manutencoes.forEach(manutencao => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            let dataFormatada = manutencao.data;
            if (manutencao.data && manutencao.data.includes("-")) {
                const partes = manutencao.data.split("-");
                dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            itemDiv.innerHTML = `
                <span>
                    🌿 ${manutencao.nomePlanta || 'Planta'} - ${manutencao.tipo} (${dataFormatada})
                    <br><small style="color: #666;">Responsável: ${manutencao.responsavel || 'Não informado'}</small>
                </span>
                <div class="acoes">
                    <button class="btn-ver" onclick="alert('Descrição: ${manutencao.descricao || "Sem descrição"}')">Ver</button>
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
// 3. PREPARAR EDIÇÃO (Puxa os dados de volta para a tela)
// ======================================================
function prepararEdicao(manutencao) {
    // Preenche os campos do formulário
    document.getElementById("data").value = manutencao.data || "";
    document.getElementById("tipo").value = manutencao.tipo || "Rega";
    document.getElementById("descricao").value = manutencao.descricao || "";
    document.getElementById("responsavel").value = manutencao.responsavel || "";
    
    if (manutencao.plantaId) {
        selectPlanta.value = manutencao.plantaId;
    }

    // Entra no Modo Edição
    manutencaoEmEdicaoId = manutencao.id;
    btnSubmit.textContent = "💾 Salvar Alterações";
    
    // Rola a tela suavemente até o formulário
    formCadastro.scrollIntoView({ behavior: 'smooth' });
}

// ======================================================
// 4. CADASTRAR OU ATUALIZAR MANUTENÇÃO
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosManutencao = {
        data: document.getElementById("data").value,
        tipo: document.getElementById("tipo").value,
        descricao: document.getElementById("descricao").value.trim(),
        responsavel: document.getElementById("responsavel").value.trim(),
        plantaId: parseInt(selectPlanta.value)
    };

    try {
        let resposta;
        
        if (manutencaoEmEdicaoId) {
            // Se estamos editando, faz um PUT
            resposta = await fetch(`${API_MANUTENCOES}/${manutencaoEmEdicaoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosManutencao)
            });
        } else {
            // Se for novo, faz um POST
            resposta = await fetch(API_MANUTENCOES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosManutencao)
            });
        }

        if (resposta.ok) {
            alert(manutencaoEmEdicaoId ? "✅ Registro atualizado com sucesso!" : "✅ Manutenção registrada com sucesso!");
            
            // Reseta o formulário e sai do modo edição
            formCadastro.reset();
            manutencaoEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            
            carregarManutencoes();
        } else {
            // Como o Java ainda não tem o PUT, ele vai responder um erro (405 método não permitido ou 404)
            if (manutencaoEmEdicaoId) {
                alert("⚠️ Quase lá! O Front-end enviou a alteração, mas a sua dupla precisa adicionar o método @PutMapping no ManutencaoController do Java para salvar.");
            } else {
                alert("❌ Erro ao registrar manutenção. Verifique os dados.");
            }
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 5. EXCLUIR MANUTENÇÃO
// ======================================================
async function excluirManutencao(id) {
    if (!confirm("Tem certeza que deseja apagar este registro de manutenção?")) return;

    try {
        const resposta = await fetch(`${API_MANUTENCOES}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("🗑️ Registro de manutenção excluído!");
            carregarManutencoes();
        } else {
            alert("❌ Erro ao tentar excluir a manutenção.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

// ======================================================
// 6. FILTRO DE PESQUISA
// ======================================================
formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    const termo = document.getElementById("pesquisa").value;
    carregarManutencoes(termo);
});

// Inicialização da página
carregarSelectPlantas();
carregarManutencoes();