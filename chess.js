const readline = require("readline");

const createBoard = () => {
  return Array.from({ length: 8 }, () => Array(8).fill(" "));
};

const setupBoard = () => {
  // White pieces are in uppercases
  // Black pieces in lowercases
  // H is knight, H for Horse
  const board = createBoard();
  const whiteBackRow = ["R", "H", "B", "Q", "K", "B", "H", "R"];
  const whiteFrontRow = Array(8).fill("P");
  const blackFrontRow = Array(8).fill("p");
  const blackBackRow = whiteBackRow.map((item) => item.toLowerCase());
  board[0] = blackBackRow;
  board[1] = blackFrontRow;
  board[6] = whiteFrontRow;
  board[7] = whiteBackRow;

  return board;
};

const printBoard = (board) => {
  console.log("\n a b c d e f g h");
  board.forEach((row, i) => {
    console.log(
      `${8 - i} ${row.map((cell) => (cell === " " ? "." : cell)).join(" ")} ${
        8 - i
      }`
    );
  });
  console.log(" a b c d e f g h\n");
};

const parseInput = (input) => {
  // matching chess board format in regex. Row must be a-h and column must be 1-8
  // before and after separated by space (e.g.: a1 a2)
  const regex = /([a-h][1-8]|\d,\d)\s+([a-h][1-8]|\d,\d)/i;
  const match = input.trim().match(regex);
  if (!match) return null;

  const toCoord = (str) => {
    if (str.includes(",")) {
      const [r, c] = str.split(",").map((x) => parseInt(x.trim()) - 1);
      return [7 - r, c];
    }
    const file = str[0].toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
    const rank = 8 - parseInt(str[1]);
    return [rank, file];
  };

  return { from: toCoord(match[1]), to: toCoord(match[2]) };
};

const isValidPosition = (row, column) =>
  row >= 0 && row < 8 && column >= 0 && column < 8;

const getPiece = (board, [row, column]) =>
  isValidPosition(row, column) ? board[row][column] : null;

const movePiece = (board, from, to) => {
  const newBoard = board.map((row) => [...row]);
  const piece = getPiece(board, from);
  newBoard[to[0]][to[1]] = piece;
  newBoard[from[0]][from[1]] = " ";
  return newBoard;
};

const applyMove = (board, from, to) => {
  const piece = getPiece(board, from);
  let newBoard = movePiece(board, from, to);

  // Pawn promotion
  if (piece === "P" && to[0] === 0) newBoard[to[0]][to[1]] = "Q";
  if (piece === "p" && to[0] === 7) newBoard[to[0]][to[1]] = "q";
  return newBoard;
};

// Game Loop (Functional)
const startGame = async () => {
  let board = setupBoard();
  let turnWhite = true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = (q) => new Promise((res) => rl.question(q, res));

  while (true) {
    printBoard(board);
    console.log(`${turnWhite ? "White" : "Black"}'s move.`);

    const moveInput = await ask("Enter move (e.g., b2 b3): ");
    const parsed = parseInput(moveInput);
    if (!parsed) {
      console.log("Invalid format. Try again.");
      continue;
    }

    const { from, to } = parsed;
    const piece = getPiece(board, from);
    if (!piece || piece === " ") {
      console.log("No piece at that position.");
      continue;
    }

    if (
      (turnWhite && piece !== piece.toUpperCase()) ||
      (!turnWhite && piece !== piece.toLowerCase())
    ) {
      console.log("Not your piece.");
      continue;
    }

    board = applyMove(board, from, to);

    turnWhite = !turnWhite;
  }
};

// Start the game
if (require.main === module) {
  console.log(
    "Welcome to Chess Console Game! Capitalized is white, lowercase is black"
  );

  startGame();
}
