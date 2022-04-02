const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");

let answer = "";
let flag = true;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    "X-RapidAPI-Key": "abc5f0915dmsh5a1bb42e0afed69p1633e8jsn3805a11abe11",
  },
};

getNewWord = () => {
  const apiResponse = fetch(
    "https://wordsapiv1.p.rapidapi.com/words/?letters=5&random=true",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      // console.log(response);
      return response;
    })
    .catch((err) => console.error(err));

  return apiResponse;
};
checkWord = (word) => {
  fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  )
    .then((res) => {
      if(res.status) flag = false;
      else flag = true;
      res.json;
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
};

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

closeModal = () => {
  document.querySelector(".modal").style.display = "none";
  document.querySelector("#answer").style.display = "none";
  init();
};

showModal = () => {
  const span = document.getElementsByClassName("close")[0];
  const modal = document.querySelector(".modal");
  const answerPara = document.querySelector("#answer");
  const newGameBtn = document.querySelector(".modal #new-game");

  modal.style.display = "block";
  answerPara.style.display = "block";

  span.onclick = () => closeModal();

  window.onclick = (event) => (event.target == modal ? closeModal() : null);

  newGameBtn.onclick = () => closeModal();
};

finishGame = () => {
  const answerPara = document.querySelector("#answer");

  if (attempts.slice(-1)[0] === answer) {
    answerPara.innerHTML = `Congratulations!, You Won <br/> The answer is  <span style="color:green;"> ${answer} </span>`;
  } else if (attempts.length > 5) {
    answerPara.innerHTML = `Try Again! <br/> The answer Was <span style="color:green;"> ${answer} </span>`;
  }
  showModal();
};

function handleInput(e) {
  const key = e.key.toLowerCase();

  if (key === "enter" && currentAttempt.length === 5) {
    attempts.push(currentAttempt);
    currentAttempt = "";
    renderAttempts();
    if (attempts.slice(-1)[0] === answer || attempts.length > 5) finishGame();
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

async function init() {
  attempts = [];
  currentAttempt = "";

  drawGrid();
  drawKeyboard();

  while(flag) {
    answer = await getNewWord();
    checkWord(answer.word);
  }

  console.log(answer);
  answer = answer.word;

  renderAttempts();
  renderCurrentAttempt();
  document.removeEventListener("keydown", handleInput);
  document.addEventListener("keydown", handleInput);
}

init();
