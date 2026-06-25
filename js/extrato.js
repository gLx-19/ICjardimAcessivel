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

async function consultar() {
    if ($("#formulario").valid()) {
        let select = document.querySelector("#conta");
        let contaId = select.value;

        let corpo = document.querySelector("#tabela tbody");
        corpo.innerHTML = "";

        try {
            let resposta = await fetch(`https://api-banco.odiloncorrea.com/lancamentos?contaId=${contaId}`);
            let lancamentos = await resposta.json();

            lancamentos.forEach(lancamento => {
                let novaLinha = corpo.insertRow();

                novaLinha.insertCell(0).innerText = lancamento.tipo;
                novaLinha.insertCell(1).innerText = formatarMoeda(lancamento.valor);
            });

            iniciarSessao();

        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro ao consultar lançamentos.");
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
        }
    },
    messages: {
        conta: {
            required: "Campo obrigatório"
        }
    }
});