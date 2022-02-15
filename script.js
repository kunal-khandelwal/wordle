
const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");

let answer = "";

// try making api to fetch from some dictionary
const words = ["panic", "world", "eagle", "bends"];

let attempts = [];
let currentAttempt = "";

function drawGrid() {
  grid.innerHTML = "";

  for (i = 0; i < 6; i++) {
    for (j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      grid.appendChild(cell);
    }
  }
}

function drawKeyboard() {
  keyboard.innerHTML = "";

  renderKeyboardRow("qwertyuiop");
  renderKeyboardRow("asdfghjkl");
  renderKeyboardRow("zxcvbnm");
}

function renderKeyboardRow(chars) {
  const row = document.createElement("div");

  for (const c of chars) {
    const key = document.createElement("button");
    key.textContent = c;
    key.onclick = () => playLetter(c);

    row.appendChild(key);
  }

  keyboard.appendChild(row);
}

function renderAttempts() {
  for (i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];

    for (j = 0; j < 5; j++) {
      const letter = attempt[j];

      cell = grid.children[i * 5 + j];
      cell.textContent = letter;

      if (letter === answer[j]) {
        cell.style.backgroundColor = "green";
      } else if (answer.includes(letter)) {
        cell.style.backgroundColor = "#bfbf2e";
      } else {
        cell.style.backgroundColor = "#000";
      }
    }
  }
}

function renderCurrentAttempt() {
  for (i = 0; i < 5; i++) {
    const letter = currentAttempt[i] || "";

    cell = grid.children[attempts.length * 5 + i];
    cell.textContent = letter;
  }
}

function playLetter(letter) {
  currentAttempt = currentAttempt + letter;

  renderCurrentAttempt();
}

function handleInput(e) {
  const key = e.key.toLowerCase();

  if (key === "enter" && currentAttempt.length === 5) {
    attempts.push(currentAttempt);
    currentAttempt = "";

    renderAttempts();
  }

  if (key === "backspace" && currentAttempt.length) {
    const letters = currentAttempt.split("");
    letters.pop();
    currentAttempt = letters.join("");

    renderCurrentAttempt();
  }

  if (/^[a-z]$/.test(key) && currentAttempt.length < 5) {
    playLetter(key);
  }
}

function init() {
  attempts = [];
  currentAttempt = "";

  answer = words[Math.floor(Math.random() * words.length)];

  document.getElementById("answer").textContent = answer;

  drawGrid();
  drawKeyboard();

  renderAttempts();
  renderCurrentAttempt();

  document.removeEventListener("keydown", handleInput);
  document.addEventListener("keydown", handleInput);
}

init();
