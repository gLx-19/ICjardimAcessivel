// QUAL PLANTA FOI CLICADA
// ID lá da barra do navegador (ex: planta.html?id=2 -> pega o número 2)
const urlParams = new URLSearchParams(window.location.search);
const idDaPlanta = parseInt(urlParams.get('id'));

// Puxa as plantas salvas no LocalStorage
const plantasCadastradas = JSON.parse(localStorage.getItem('plantas')) || [];

// Encontra exatamente a planta clicada na lista
const planta = plantasCadastradas.find(p => p.id === idDaPlanta);

// 2. carregar informações dinamicamente
if (planta) {
    // substitui os textos do HTML da Sabrina pelos dados reais
    document.getElementById('imagemPlanta').src = planta.imagem;
    document.getElementById('imagemPlanta').alt = planta.nome;
    document.getElementById('nomePlanta').innerText = planta.nome;
    document.getElementById('nomeCientifico').innerText = planta.nomeCientifico;
    document.getElementById('descricaoPlanta').innerText = planta.descricao;
    
    document.getElementById('rega').innerText = planta.rega;
    document.getElementById('poda').innerText = planta.poda;
    document.getElementById('luminosidade').innerText = planta.luminosidade;
    document.getElementById('familia').innerText = planta.familia;
} else {
    // Se acessar a página sem ID, mostra erro
    document.querySelector('.card').innerHTML = `
        <h2>Planta não encontrada!</h2>
        <br>
        <button class="btn-pesquisar" onclick="window.location.href='catalogo.html'">Voltar ao Catálogo</button>
    `;
}