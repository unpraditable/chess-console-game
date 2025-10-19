const readline = require("readline");

const createBoard = () => Array.from({ length: 8 }, () => Array(8).fill(" "));

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
  console.log("\n  a b c d e f g h");
  board.forEach((row, i) => {
    console.log(
      `${8 - i} ${row.map((cell) => (cell === " " ? "." : cell)).join(" ")} ${
        8 - i
      }`
    );
  });
  console.log("  a b c d e f g h\n");
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

const isSameColor = (a, b) => {
  if (!a || !b || a === " " || b === " ") return false;
  return (a === a.toUpperCase()) === (b === b.toUpperCase());
};

const applyMove = (board, from, to) => {
  const piece = getPiece(board, from);
  let newBoard = movePiece(board, from, to);

  // Pawn promotion
  if (piece === "P" && to[0] === 0) newBoard[to[0]][to[1]] = "Q";
  if (piece === "p" && to[0] === 7) newBoard[to[0]][to[1]] = "q";
  return newBoard;
};

// Move validation
const isValidPawnMove = (board, from, to, piece) => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const direction = piece === "P" ? -1 : 1;
  const startRow = piece === "P" ? 6 : 1;
  const targetPiece = getPiece(board, to);

  const rowDiff = toRow - fromRow;
  const colDiff = Math.abs(toCol - fromCol);

  // Forward move, must empty tile, must be straight 1 tile, except first move
  if (colDiff === 0 && targetPiece === " ") {
    if (rowDiff === direction) return true;
    // First move, can move 2 tiles
    if (fromRow === startRow && rowDiff === 2 * direction) {
      return getPiece(board, [fromRow + direction, fromCol]) === " ";
    }
  }

  // Capture, must be different color, and must not empty tile
  if (colDiff === 1 && rowDiff === direction && targetPiece !== " ") {
    return !isSameColor(piece, targetPiece);
  }

  return false;
};

const isValidRookMove = (board, from, to) => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  // Straight move rook movement pattern
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;
  }

  // Check if path is clear
  return isPathClear(board, from, to);
};

const isValidBishopMove = (board, from, to) => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  // Diagonal movement pattern
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  if (rowDiff !== colDiff) {
    return false;
  }

  // Check if path is clear
  return isPathClear(board, from, to);
};

const isPathClear = (board, from, to) => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  // determine the direction of row and col, 1 or -1
  const rowStep = Math.sign(toRow - fromRow);
  const colStep = Math.sign(toCol - fromCol);

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  // step it one by one, until it meets an obstacle
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol] !== " ") {
      return false;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
};

const isValidKnightMove = (from, to) => {
  // Knight can move freely without checking emptyCell, as long as either rowDiff and colDiff is 2 AND 1, vice versa
  const rowDiff = Math.abs(to[0] - from[0]);
  const colDiff = Math.abs(to[1] - from[1]);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

const isValidKingMove = (from, to) => {
  const rowDiff = Math.abs(to[0] - from[0]);
  const colDiff = Math.abs(to[1] - from[1]);
  return rowDiff <= 1 && colDiff <= 1;
};

const isLegalMove = (board, from, to) => {
  const piece = getPiece(board, from);
  const target = getPiece(board, to);
  if (!piece || piece === " " || isSameColor(piece, target)) return false;

  switch (piece.toLowerCase()) {
    case "p": {
      return isValidPawnMove(board, from, to, piece);
    }
    case "r": {
      return isValidRookMove(board, from, to);
    }
    case "h": {
      return isValidKnightMove(from, to);
    }
    case "b": {
      return isValidBishopMove(board, from, to);
    }
    case "q":
      // Queen is basically just a combinaton of Rook and Bishop
      return (
        isValidRookMove(board, from, to) || isValidBishopMove(board, from, to)
      );
    case "k":
      return isValidKingMove(from, to);
    default:
      return false;
  }
};

const checkWinner = (board) => {
  const flat = board.flat();
  const hasWhiteKing = flat.includes("K");
  const hasBlackKing = flat.includes("k");
  if (!hasWhiteKing) return "Black wins!";
  if (!hasBlackKing) return "White wins!";
  return null;
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

    if (!isLegalMove(board, from, to)) {
      console.log("Illegal move.");
      continue;
    }

    board = applyMove(board, from, to);
    const winner = checkWinner(board);
    if (winner) {
      printBoard(board);
      console.log(winner);
      break;
    }

    turnWhite = !turnWhite;
  }
};

// Export functions for testing
module.exports = {
  createBoard,
  setupBoard,
  isValidPosition,
  getPiece,
  isLegalMove,
  applyMove,
  movePiece,
  parseInput,
  printBoard,
  isValidPawnMove,
  isValidRookMove,
  isValidBishopMove,
  isValidKnightMove,
  isValidKingMove,
  isSameColor,
  isPathClear,
  checkWinner,
};

// Start the game
if (require.main === module) {
  console.log(
    "Welcome to Chess Console Game! Capitalized is white, lowercase is black"
  );

  startGame();
}
