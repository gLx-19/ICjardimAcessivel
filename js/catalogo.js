
const divListaPlantas = document.getElementById('listaPlantas');
const inputPesquisa = document.getElementById('pesquisa');
const formPesquisa = document.getElementById('formPesquisa');


// ⚠️ ESSA LINHA APAGA A MEMÓRIA ANTIGA PARA A IMAGEM DA HORTELÃ APARECER!
// Depois que funcionar a primeira vez, se quiser, pode apagar essa linha.

const plantasDeTeste = [
    { 
        id: 1, 
        nome: "Lavanda", 
        nomeCientifico: "Lavandula angustifolia", 
        descricao: "A lavanda é uma planta muito conhecida por seu aroma relaxante e propriedades medicinais.",
        rega: "2 vezes por semana", 
        poda: "A cada 3 meses", 
        luminosidade: "Sol pleno", 
        familia: "Lamiaceae", 
        imagem: "imagens/lavanda.png" 
    },
    { 
        id: 2, 
        nome: "Hortelã", 
        nomeCientifico: "Mentha", 
        descricao: "Planta muito refrescante, excelente para chás e temperos.",
        rega: "Diária (manter terra úmida)", 
        poda: "Mensal", 
        luminosidade: "Meia sombra", 
        familia: "Lamiaceae", 
        imagem: "imagens/hortela.png" 
    },
    { 
        id: 3, 
        nome: "Girassol", 
        nomeCientifico: "Helianthus annuus", 
        descricao: "Planta que acompanha o movimento do sol, trazendo muita vida ao jardim.",
        rega: "3 vezes por semana", 
        poda: "Retirar folhas secas", 
        luminosidade: "Sol pleno", 
        familia: "Asteraceae", 
        imagem: "imagens/girassol.png"
    }
];

// Salva as plantas no "banco de dados" do navegador, se estiver vazio
if (!localStorage.getItem('plantas')) {
    localStorage.setItem('plantas', JSON.stringify(plantasDeTeste));
}

// buscar plantas cadastradas
const plantasCadastradas = JSON.parse(localStorage.getItem('plantas')) || [];

// mostrar vários cards automaticamente
// =========================================================
function renderizarCatalogo(plantas) {
    divListaPlantas.innerHTML = ''; 

    if (plantas.length === 0) {
        divListaPlantas.innerHTML = '<p>Nenhuma planta encontrada na pesquisa.</p>';
        return;
    }

    plantas.forEach(planta => {
        const cardHTML = `
            <div class="card" style="margin-bottom: 20px; padding: 15px; text-align: center;">
                <img src="${planta.imagem}" alt="${planta.nome}" style="max-width: 150px; border-radius: 8px;">
                <h3>${planta.nome}</h3>
                <p><i>${planta.nomeCientifico}</i></p>
                <button class="btn-pesquisar" onclick="verDetalhes(${planta.id})" style="margin-top: 10px;">Saber Mais</button>
            </div>
        `;
        divListaPlantas.innerHTML += cardHTML;
    });
}

// redireciona para a página da planta levando o ID na URL
window.verDetalhes = function(id) {
    window.location.href = `planta.html?id=${id}`;
};

// 4. pesquisa funcionar
formPesquisa.addEventListener('submit', function(event) {
    event.preventDefault(); 
});

inputPesquisa.addEventListener('input', function() {
    const textoDigitado = inputPesquisa.value.toLowerCase();
    
    const plantasFiltradas = plantasCadastradas.filter(p => 
        p.nome.toLowerCase().includes(textoDigitado) || 
        p.nomeCientifico.toLowerCase().includes(textoDigitado)
    );
    
    renderizarCatalogo(plantasFiltradas);
});

// desenha tudo logo que a página abre
renderizarCatalogo(plantasCadastradas);