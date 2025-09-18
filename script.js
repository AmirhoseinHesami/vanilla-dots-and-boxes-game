const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];
let scores = { R: 0, B: 0 };
let gameOver = false;

const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) =>
  `It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const wonText = (winner) => `${winner} won`;

const isLineSelected = (line) =>
  line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

// Check if a square is completed by player 'turn' after placing the line with id lineId
const checkCompletedSquares = (lineId) => {
  // lineId examples: "h-1-2" or "v-0-3"
  // Gather coordinates from lineId
  const [type, rStr, cStr] = lineId.split("-");
  const row = parseInt(rStr, 10);
  const col = parseInt(cStr, 10);
  let completedAny = false;

  // Helper: check if all 4 lines of square at (r, c) are selected
  const isSquareComplete = (r, c) => {
    const top = document.getElementById(`h-${r}-${c}`);
    const bottom = document.getElementById(`h-${r + 1}-${c}`);
    const left = document.getElementById(`v-${r}-${c}`);
    const right = document.getElementById(`v-${r}-${c + 1}`);

    return (
      top &&
      bottom &&
      left &&
      right &&
      isLineSelected(top) &&
      isLineSelected(bottom) &&
      isLineSelected(left) &&
      isLineSelected(right)
    );
  };

  // Helper to color box and assign score
  const colorBox = (r, c) => {
    console.log(r, c);
    const box = document.getElementById(`box-${r}-${c}`);
    if (
      box &&
      !box.classList.contains(bgClasses.R) &&
      !box.classList.contains(bgClasses.B)
    ) {
      box.classList.add(bgClasses[turn]);
      scores[turn]++;
      completedAny = true;
    }
  };

  // Depending on line type, check adjacent squares
  if (type === "h") {
    // Horizontal line can be top edge of square below or bottom edge of square above
    // Check square above if exists
    if (row > 0 && isSquareComplete(row - 1, col)) {
      colorBox(row - 1, col);
    }
    // Check square below if exists
    if (row < N - 1 && isSquareComplete(row, col)) {
      colorBox(row, col);
    }
  } else if (type === "v") {
    // Vertical line can be left edge of square to right or right edge of square to left
    // Check square to left if exists
    if (col > 0 && isSquareComplete(row, col - 1)) {
      colorBox(row, col - 1);
    }
    // Check square to right if exists
    if (col < M - 1 && isSquareComplete(row, col)) {
      colorBox(row, col);
    }
  }

  return completedAny;
};

const createGameGrid = () => {
  const gameGridContainer = document.getElementsByClassName(
    "game-grid-container"
  )[0];

  const rows = Array(N)
    .fill(0)
    .map((_, i) => i);
  const cols = Array(M)
    .fill(0)
    .map((_, i) => i);

  rows.forEach((row) => {
    cols.forEach((col) => {
      const dot = document.createElement("div");
      dot.setAttribute("class", "dot");

      const hLine = document.createElement("div");
      hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
      hLine.setAttribute("id", `h-${row}-${col}`);
      hLine.addEventListener("click", handleLineClick);

      gameGridContainer.appendChild(dot);
      if (col < M - 1) gameGridContainer.appendChild(hLine);
    });

    if (row < N - 1) {
      cols.forEach((col) => {
        const vLine = document.createElement("div");
        vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
        vLine.setAttribute("id", `v-${row}-${col}`);
        vLine.addEventListener("click", handleLineClick);

        const box = document.createElement("div");
        box.setAttribute("class", "box");
        box.setAttribute("id", `box-${row}-${col}`);

        gameGridContainer.appendChild(vLine);
        if (col < M - 1) gameGridContainer.appendChild(box);
      });
    }
  });

  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const updateHoverClasses = () => {
  const lines = document.querySelectorAll(".line-vertical, .line-horizontal");
  lines.forEach((l) => {
    if (!isLineSelected(l)) {
      l.classList.remove(...Object.values(hoverClasses));
      l.classList.add(hoverClasses[turn]);
    }
  });
};

const changeTurn = (squareFormed) => {
  if (!squareFormed) {
    turn = turn === "R" ? "B" : "R";
  }
  updateHoverClasses();
  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const handleLineClick = (e) => {
  if (gameOver) return;

  const lineId = e.target.id;
  const selectedLine = document.getElementById(lineId);

  if (isLineSelected(selectedLine)) {
    return;
  }

  selectedLines = [...selectedLines, lineId];
  colorLine(selectedLine);

  // Check for completed squares
  const squareFormed = checkCompletedSquares(lineId);

  // Check if game is over: all lines filled
  const totalLines = N * (M - 1) + (N - 1) * M;
  if (selectedLines.length === totalLines) {
    gameOver = true;
    // Determine winner
    const winner =
      scores.R > scores.B ? "Red" : scores.B > scores.R ? "Blue" : "No one";
    document.getElementById("game-status").innerHTML =
      winner === "No one" ? "It's a tie!" : `${winner} won`;
    return;
  }

  changeTurn(squareFormed);
};

const colorLine = (selectedLine) => {
  selectedLine.classList.remove(hoverClasses[turn]);
  selectedLine.classList.add(bgClasses[turn]);
};

createGameGrid();
