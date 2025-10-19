const { createBoard, setupBoard, isValidPosition } = require("./chess");

describe("Chess Game Unit Tests", () => {
  describe("Board Initialization", () => {
    test("should create empty board", () => {
      const board = createBoard();
      expect(board).toHaveLength(8);
      board.forEach((row) => {
        expect(row).toHaveLength(8);
        row.forEach((cell) => expect(cell).toBe(" "));
      });
    });

    test("should setup initial board configuration", () => {
      const board = setupBoard();

      // Check black pieces (rows 0-1)
      expect(board[0][0]).toBe("r"); // black rook
      expect(board[0][1]).toBe("h"); // black knight
      expect(board[0][2]).toBe("b"); // black bishop
      expect(board[0][3]).toBe("q"); // black queen
      expect(board[0][4]).toBe("k"); // black king
      expect(board[1][0]).toBe("p"); // black pawn

      // Check white pieces (rows 6-7)
      expect(board[6][0]).toBe("P"); // white pawn
      expect(board[7][0]).toBe("R"); // white rook
      expect(board[7][1]).toBe("H"); // white knight
      expect(board[7][2]).toBe("B"); // white bishop
      expect(board[7][3]).toBe("Q"); // white queen
      expect(board[7][4]).toBe("K"); // white king

      // Check empty middle squares
      for (let row = 2; row <= 5; row++) {
        for (let col = 0; col < 8; col++) {
          expect(board[row][col]).toBe(" ");
        }
      }
    });

    test("should validate positions correctly", () => {
      expect(isValidPosition(0, 0)).toBe(true);
      expect(isValidPosition(7, 7)).toBe(true);
      expect(isValidPosition(4, 4)).toBe(true);
      expect(isValidPosition(-1, 0)).toBe(false);
      expect(isValidPosition(8, 0)).toBe(false);
      expect(isValidPosition(0, -1)).toBe(false);
      expect(isValidPosition(0, 8)).toBe(false);
      expect(isValidPosition(99, 99)).toBe(false);
      expect(isValidPosition(-99, -99)).toBe(false);
    });
  });
});
