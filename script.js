'use strict';

const numbers = Array.from({ length: 10 }, (_, index) => index + 1);
const colors = [
  '#ff2f7d', '#00a9ff', '#ffd500', '#5fd34a', '#ff6b35',
  '#8e44ff', '#00c2a8', '#ff3b30', '#2ecc71', '#f39c12'
];

const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const resultElement = document.getElementById('result');
const resultMessage = document.getElementById('resultMessage');
const historyElement = document.getElementById('history');

const slice = 360 / numbers.length;
let rotation = 0;
let spinning = false;
let history = [];
let spinTimer = null;

function createWheel() {
  const conic = numbers
    .map((_, index) => `${colors[index]} ${index * slice}deg ${(index + 1) * slice}deg`)
    .join(', ');

  wheel.style.setProperty('--conic', conic);

  numbers.forEach((number, index) => {
    const angle = index * slice + slice / 2;
    const numberElement = document.createElement('span');

    numberElement.className = 'wheel-number';
    numberElement.textContent = String(number);
    numberElement.style.transform = `rotate(${angle}deg) translateY(-185px) rotate(${-angle}deg)`;

    wheel.insertBefore(numberElement, wheel.querySelector('.hub'));
  });
}

function renderHistory() {
  historyElement.replaceChildren();

  if (history.length === 0) {
    const emptyMessage = document.createElement('em');
    emptyMessage.textContent = 'Nenhum giro ainda';
    historyElement.appendChild(emptyMessage);
    return;
  }

  history.forEach((number) => {
    const item = document.createElement('span');
    item.textContent = String(number);
    historyElement.appendChild(item);
  });
}

function setSpinningState(isSpinning) {
  spinning = isSpinning;
  spinButton.disabled = isSpinning;
  wheel.disabled = isSpinning;
  spinButton.textContent = isSpinning ? 'Girando...' : 'Girar Roleta';
}

function spinWheel() {
  if (spinning) return;

  setSpinningState(true);
  resultElement.textContent = '-';
  resultMessage.textContent = 'Aguarde o resultado...';

  const selected = Math.floor(Math.random() * numbers.length) + 1;
  const selectedIndex = selected - 1;
  const centerOfSlice = selectedIndex * slice + slice / 2;
  const extraTurns = 6 + Math.floor(Math.random() * 4);

  rotation += extraTurns * 360 + (360 - centerOfSlice);
  wheel.style.transform = `rotate(${rotation}deg)`;

  window.clearTimeout(spinTimer);
  spinTimer = window.setTimeout(() => {
    resultElement.textContent = String(selected);
    resultMessage.textContent = 'Avance no tabuleiro!';
    history = [selected, ...history].slice(0, 8);
    renderHistory();
    setSpinningState(false);
  }, 4300);
}

function resetGame() {
  window.clearTimeout(spinTimer);
  rotation = 0;
  history = [];
  wheel.style.transition = 'none';
  wheel.style.transform = 'rotate(0deg)';
  resultElement.textContent = '-';
  resultMessage.textContent = 'Clique para sortear de 1 a 10';
  setSpinningState(false);
  renderHistory();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wheel.style.transition = '';
    });
  });
}

wheel.addEventListener('click', spinWheel);
spinButton.addEventListener('click', spinWheel);
resetButton.addEventListener('click', resetGame);

createWheel();
renderHistory();
