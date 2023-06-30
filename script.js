let currentPlayer = "circle";
let fields = [null, null, null, null, null, null, null, null, null];
let winnerExists = false;

function init() {
  render();
}

function render() {
  let tableHtml = "<table>";
  for (let i = 0; i < 3; i++) {
    tableHtml += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const fieldValue = fields[index];
      let symbol = `<td id="cell-${index}" onclick="addSymbol(${index})"></td>`;
      if (fieldValue === "circle") {
        symbol = `<td>${generateCircleSVG()}</td>`;
      } else if (fieldValue === "cross") {
        symbol = `<td>${generateCrossSVG()}</td>`;
      }
      tableHtml += symbol;
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</table>";

  document.getElementById("content").innerHTML = tableHtml;
}

function addSymbol(index) {
  const fieldValue = fields[index];
  if (fieldValue === null && !winnerExists) {
    fields[index] = currentPlayer;
    const cell = document.getElementById(`cell-${index}`);
    cell.innerHTML =
      currentPlayer === "circle" ? generateCircleSVG() : generateCrossSVG();
    cell.onclick = null;
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
    checkWinCondition();
  }
}

function generateCircleSVG() {
  const color = "#00B0EF";
  const size = 70;

  const svgCode = /*html*/ `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}">
        <animate attributeName="r" from="0" to="${
          size / 2
        }" dur="1s" fill="freeze" />
      </circle>
    </svg>`;

  return svgCode;
}

function generateCrossSVG() {
  const color = "#FFC000";
  const size = 70;

  const svgCode = /*html*/ `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="10" x2="60" y2="60" stroke="${color}" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="1.5s" fill="freeze" />
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 35 35" to="360 35 35" dur="1.0s" repeatCount="1" fill="freeze" />
      </line>
      <line x1="10" y1="60" x2="60" y2="10" stroke="${color}" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="1.5s" fill="freeze" />
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 35 35" to="360 35 35" dur="1.0s" repeatCount="1" fill="freeze" />
      </line>
    </svg>
    `;
  return svgCode;
}

function checkWinCondition() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Vertical
    [0, 4, 8],
    [2, 4, 6], // Diagonal
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      winnerExists = true;
      const resultDiv = document.getElementById("result");
      resultDiv.textContent =
        fields[a] === "circle" ? "Kreis hat gewonnen!" : "Kreuz hat gewonnen!";
      resultDiv.style.backgroundColor =
        fields[a] === "circle" ? "#00B0EF" : "#FFC000";
      resultDiv.style.visibility = "visible";

      drawLine(combination);
      return;
    }
  }

  if (!fields.includes(null)) {
    // Unentschieden
    winnerExists = true;
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "Unentschieden!";
    resultDiv.style.background = "linear-gradient(#FFC000, #00B0EF)";
    resultDiv.style.visibility = "visible";
  }
}

function drawLine(combination) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const cellSize = 70;
  const padding = 35;
  const [a, b, c] = combination;

  const startX = padding + (a % 3) * cellSize + cellSize / 2;
  const startY = padding + Math.floor(a / 3) * cellSize + cellSize / 2;
  const endX = padding + (c % 3) * cellSize + cellSize / 2;
  const endY = padding + Math.floor(c / 3) * cellSize + cellSize / 2;

  const lineLength = cellSize * Math.sqrt(2); // Diagonale Länge der Zelle

  const dx = ((endX - startX) / lineLength) * 30; // Verlängerung um 30 Pixel
  const dy = ((endY - startY) / lineLength) * 30; // Verlängerung um 30 Pixel

  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(startX - dx, startY - dy);
  ctx.lineTo(endX + dx, endY + dy);
  ctx.stroke();
}

function resetGame() {
  currentPlayer = "circle";
  fields = [null, null, null, null, null, null, null, null, null];
  winnerExists = false;

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resultDiv.style.visibility = "hidden";
  render();
}
