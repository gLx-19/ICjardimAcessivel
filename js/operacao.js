$(document).ready(function () {
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    } else {
        let cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        let partes = cliente.nome.split(' ');
        let primeiroNome = partes[0];
        $("#nome").text(primeiroNome);
        atualizarCaixaSelecao(cliente.id);
    }

     $('#valor').mask("#.##0,00", {reverse: true});
})

async function atualizarCaixaSelecao(clienteId) {
    let select = document.querySelector("#conta");

    // limpa opções existentes
    select.innerHTML = '<option selected disabled>Selecione uma conta</option>';

    try {
        let resposta = await fetch("https://api-banco.odiloncorrea.com/contas?clienteId=" + clienteId);
        let contas = await resposta.json();

        contas.forEach(conta => {
            let option = document.createElement("option");

            option.value = conta.id; // ou conta.numero, dependendo do que você precisa
            option.text = `${conta.numero} - ${formatarMoeda(conta.saldo)}`;

            select.appendChild(option);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao consultar contas.");
    }
}

async function confirmar() {
    if ($("#formulario").valid()) {
        let contaSelect = document.querySelector("#conta");
        let contaId = parseInt(contaSelect.value); // valor do select

        let operacaoSelect = document.querySelector("#operacao");
        let tipo = operacaoSelect.value;     

        let valorInput = document.querySelector("#valor");
        let valorFormatado = valorInput.value;

        // remove máscara e converte para número
        let valor = parseFloat(
            valorFormatado
                .replace(/\./g, '')   // remove separador de milhar
                .replace(',', '.')    // substitui vírgula por ponto
                .replace('R$', '')    // remove símbolo, se houver
                .trim()
        );

        // monta objeto do lançamento
        let lancamento = {
            valor: valor,
            tipo: tipo,
            contaId: contaId
        };

        try {
            let resposta = await fetch("https://api-banco.odiloncorrea.com/lancamentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(lancamento)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao registrar lançamento");
            }

            let resultado = await resposta.json();
            console.log("Lançamento realizado:", resultado);
            
            iniciarSessao();

            alert("Lançamento realizado com sucesso!");

            // limpar campos
            valorInput.value = "";
            contaSelect.value= "";
            operacaoSelect.value= "";

        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro ao realizar lançamento.");
        }
    }
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

$("#formulario").validate({
    rules: {
        conta: {
            required: true
        },
        operacao: {
            required: true
        },
        valor: {
            required: true
        }                
    },
    messages: {
        conta: {
            required: "Campo obrigatório"
        },
        operacao: {
            required: "Campo obrigatório"
        },
        valor: {
            required: "Campo obrigatório"
        }                
    }
});