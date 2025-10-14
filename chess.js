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

// Game Loop (Functional)
const startGame = () => {
  let board = setupBoard();

  printBoard(board);

  console.log(
    "Welcome to Chess Console Game! Capitalized is white, lowercase is black"
  );
};

// Start the game
if (require.main === module) {
  console.log(
    "Welcome to Chess Console Game! Capitalized is white, lowercase is black"
  );

  startGame();
}
