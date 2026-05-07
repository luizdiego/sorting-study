const container = document.getElementById('container-barras');
const totalBarras = 10;
const tempoEspera = 1000; 
let arrayValores = [];

function gerarBarras() {
    container.innerHTML = '';
    arrayValores = [];
    for (let i = 0; i < totalBarras; i++) {
        let valor = Math.floor(Math.random() * 10) + 1; 
        arrayValores.push(valor);

        let barra = document.createElement('div');
        barra.classList.add('barra');
        barra.style.height = `${valor * 25}px`; 
        barra.innerText = valor;
        barra.id = `barra-${i}`;
        container.appendChild(barra);
    }
}

function esperar() {
    return new Promise(resolve => setTimeout(resolve, tempoEspera));
}

async function trocar(i, j) {
    let temp = arrayValores[i];
    arrayValores[i] = arrayValores[j];
    arrayValores[j] = temp;

    let barraI = document.getElementById(`barra-${i}`);
    let barraJ = document.getElementById(`barra-${j}`);

    let alturaTemp = barraI.style.height;
    let textoTemp = barraI.innerText;

    barraI.style.height = barraJ.style.height;
    barraI.innerText = barraJ.innerText;

    barraJ.style.height = alturaTemp;
    barraJ.innerText = textoTemp;

    await esperar();
}

async function particionar(baixo, alto) {
    let pivo = arrayValores[alto]; 
    let barraPivo = document.getElementById(`barra-${alto}`);
    barraPivo.classList.add('pivo'); 

    let i = baixo - 1;

    for (let j = baixo; j < alto; j++) {
        let barraAtual = document.getElementById(`barra-${j}`);
        barraAtual.classList.add('comparando'); 
        
        await esperar(); 

        if (arrayValores[j] < pivo) {
            i++;
            if (i !== j) {
                await trocar(i, j); 
            }
        }
        barraAtual.classList.remove('comparando'); 
    }

    if (i + 1 !== alto) {
        await trocar(i + 1, alto);
    }
    
    barraPivo.classList.remove('pivo'); 
    return i + 1;
}

async function quicksortInPlace(baixo, alto) {
    if (baixo < alto) {
        let indicePivo = await particionar(baixo, alto);
        
        document.getElementById(`barra-${indicePivo}`).classList.add('ordenado');

        await quicksortInPlace(baixo, indicePivo - 1);
        await quicksortInPlace(indicePivo + 1, alto);
    } else if (baixo >= 0 && alto >= 0 && baixo < arrayValores.length && alto < arrayValores.length) {
        if (baixo === alto) {
            document.getElementById(`barra-${baixo}`).classList.add('ordenado');
        }
    }
}

async function iniciarOrdenacao() {
    document.getElementById('btn-gerar').disabled = true;
    document.getElementById('btn-ordenar').disabled = true;

    await quicksortInPlace(0, arrayValores.length - 1);

    for(let i = 0; i < arrayValores.length; i++) {
        document.getElementById(`barra-${i}`).classList.add('ordenado');
    }

    document.getElementById('btn-gerar').disabled = false;
    document.getElementById('btn-ordenar').disabled = false;
}

// Inicia a geração das barras ao carregar o script
gerarBarras();
