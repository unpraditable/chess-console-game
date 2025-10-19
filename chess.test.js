const {
  createBoard,
  setupBoard,
  isValidPosition,
  getPiece,
  isLegalMove,
  applyMove,
  movePiece,
  isSameColor,
  isValidPawnMove,
  isValidRookMove,
  isValidBishopMove,
  isValidKnightMove,
  isValidKingMove,
  isPathClear,
  checkWinner,
} = require("./chess");

describe("Chess Game Unit Tests", () => {
  describe("Board Functions", () => {
    test("createBoard should create an 8x8 empty board", () => {
      const board = createBoard();
      expect(board).toHaveLength(8);
      board.forEach((row) => {
        expect(row).toHaveLength(8);
        row.forEach((cell) => expect(cell).toBe(" "));
      });
    });

    test("setupBoard should initialize pieces correctly", () => {
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
      expect(isValidPosition(100, 100)).toBe(false);
    });

    test("getPiece should return correct piece or null", () => {
      const board = setupBoard();
      expect(getPiece(board, [0, 0])).toBe("r");
      expect(getPiece(board, [7, 0])).toBe("R");
      expect(getPiece(board, [4, 4])).toBe(" ");
      expect(getPiece(board, [-1, 0])).toBe(null);
    });
  });

  describe("isSameColor", () => {
    test("isSameColor should detect same colored pieces", () => {
      expect(isSameColor("R", "P")).toBe(true);
      expect(isSameColor("r", "p")).toBe(true);
      expect(isSameColor("R", "r")).toBe(false);
      expect(isSameColor("P", "p")).toBe(false);
      expect(isSameColor("R", " ")).toBe(false);
      expect(isSameColor(" ", "P")).toBe(false);
    });
  });

  describe("isPathClear", () => {
    test("isPathClear should detect clear paths", () => {
      const board = createBoard();
      board[3][3] = "R"; // rook at center

      // Clear horizontal path
      expect(isPathClear(board, [3, 3], [3, 6])).toBe(true);

      // Clear vertical path
      expect(isPathClear(board, [3, 3], [6, 3])).toBe(true);

      // Clear diagonal path
      expect(isPathClear(board, [3, 3], [6, 6])).toBe(true);
    });

    test("isPathClear should detect blocked paths", () => {
      const board = createBoard();
      board[3][3] = "R";
      board[3][5] = "P"; // block horizontal
      board[5][3] = "p"; // block vertical
      board[5][5] = "P"; // block diagonal

      expect(isPathClear(board, [3, 3], [3, 7])).toBe(false);
      expect(isPathClear(board, [3, 3], [7, 3])).toBe(false);
      expect(isPathClear(board, [3, 3], [7, 7])).toBe(false);
    });
  });

  describe("isValidPawnMove", () => {
    test("white pawn can move forward one square", () => {
      const board = createBoard();
      board[6][4] = "P"; // e2

      expect(isValidPawnMove(board, [6, 4], [5, 4], "P")).toBe(true); // e2-e3
    });

    test("white pawn can move forward two squares from start", () => {
      const board = createBoard();
      board[6][4] = "P"; // e2

      expect(isValidPawnMove(board, [6, 4], [4, 4], "P")).toBe(true); // e2-e4
    });

    test("white pawn cannot move forward two squares after first move", () => {
      const board = createBoard();
      board[5][4] = "P"; // e3 (already moved)

      expect(isValidPawnMove(board, [5, 4], [3, 4], "P")).toBe(false); // e3-e5
    });

    test("white pawn can capture diagonally", () => {
      const board = createBoard();
      board[5][4] = "P"; // e3
      board[4][3] = "p"; // black pawn at d4

      expect(isValidPawnMove(board, [5, 4], [4, 3], "P")).toBe(true); // e3xd4
    });

    test("black pawn cannot capture diagonally reverse", () => {
      const board = createBoard();
      board[3][2] = "P"; // white pawn at c5
      board[4][3] = "p"; // black pawn at d4

      expect(isValidPawnMove(board, [4, 3], [3, 2], "p")).toBe(false); // d4xc5 (black can't capture backward)
    });

    test("white pawn cannot capture forward", () => {
      const board = createBoard();
      board[5][4] = "P"; // e3
      board[4][4] = "p"; // black pawn blocking at e4

      expect(isValidPawnMove(board, [5, 4], [4, 4], "P")).toBe(false); // e3xe4 (can't capture straight)
    });

    test("black pawn can move downward", () => {
      const board = createBoard();
      board[1][4] = "p"; // e7

      expect(isValidPawnMove(board, [1, 4], [2, 4], "p")).toBe(true); // e7-e6
    });

    test("black pawn can move forward two squares from start", () => {
      const board = createBoard();
      board[1][4] = "p"; // e7

      expect(isValidPawnMove(board, [1, 4], [3, 4], "p")).toBe(true); // e7-e5
    });

    test("black pawn cannot move forward two squares after first move", () => {
      const board = createBoard();
      board[2][4] = "p"; // e6 (already moved)

      expect(isValidPawnMove(board, [2, 4], [4, 4], "p")).toBe(false); // e6-e4
    });

    test("black pawn can capture diagonally", () => {
      const board = createBoard();
      board[4][3] = "p"; // d4
      board[5][4] = "P"; // white pawn at e5

      expect(isValidPawnMove(board, [4, 3], [5, 4], "p")).toBe(true); // d4xe5
    });

    test("black pawn cannot capture diagonally reverse", () => {
      const board = createBoard();
      board[4][3] = "p"; // d4
      board[3][2] = "P"; // white pawn at c5

      expect(isValidPawnMove(board, [4, 3], [3, 2], "p")).toBe(false); // d4xc5 (black can't capture upward)
    });

    test("black pawn cannot capture backward", () => {
      const board = createBoard();
      board[4][4] = "p"; // e4
      board[3][4] = "P"; // white pawn at e5

      expect(isValidPawnMove(board, [4, 4], [3, 4], "p")).toBe(false); // e4xe5 (black can't capture backward)
    });
  });

  describe("Rook Movement", () => {
    test("rook can move horizontally", () => {
      const board = createBoard();
      board[4][4] = "R"; // e4

      expect(isValidRookMove(board, [4, 4], [4, 7])).toBe(true); // e4-h4
      expect(isValidRookMove(board, [4, 4], [4, 0])).toBe(true); // e4-a4
    });

    test("rook can move vertically", () => {
      const board = createBoard();
      board[4][4] = "R"; // e4

      expect(isValidRookMove(board, [4, 4], [7, 4])).toBe(true); // e4-e7
      expect(isValidRookMove(board, [4, 4], [0, 4])).toBe(true); // e4-e1
    });

    test("rook cannot move diagonally", () => {
      const board = createBoard();
      board[4][4] = "R";

      expect(isValidRookMove(board, [4, 4], [5, 5])).toBe(false);
      expect(isValidRookMove(board, [4, 4], [3, 3])).toBe(false);
    });

    test("rook cannot jump over pieces", () => {
      const board = createBoard();
      board[4][4] = "R";
      board[4][6] = "P"; // blocking piece, same color

      expect(isValidRookMove(board, [4, 4], [4, 7])).toBe(false);
    });
  });

  describe("Bishop Movement", () => {
    test("bishop can move diagonally", () => {
      const board = createBoard();
      board[4][4] = "B"; // e4

      expect(isValidBishopMove(board, [4, 4], [7, 7])).toBe(true); // e4-h7
      expect(isValidBishopMove(board, [4, 4], [1, 1])).toBe(true); // e4-a1
    });

    test("bishop cannot move horizontally or vertically", () => {
      const board = createBoard();
      board[4][4] = "B";

      expect(isValidBishopMove(board, [4, 4], [4, 7])).toBe(false);
      expect(isValidBishopMove(board, [4, 4], [7, 4])).toBe(false);
    });

    test("bishop cannot jump over pieces", () => {
      const board = createBoard();
      board[4][4] = "B";
      board[5][5] = "P"; // blocking piece, same color

      expect(isValidBishopMove(board, [4, 4], [7, 7])).toBe(false);
    });
  });

  describe("Knight Movement", () => {
    test("knight can move in L-shape", () => {
      expect(isValidKnightMove([4, 4], [6, 5])).toBe(true); // 2 down, 1 right
      expect(isValidKnightMove([4, 4], [6, 3])).toBe(true); // 2 down, 1 left
      expect(isValidKnightMove([4, 4], [2, 5])).toBe(true); // 2 up, 1 right
      expect(isValidKnightMove([4, 4], [2, 3])).toBe(true); // 2 up, 1 left
      expect(isValidKnightMove([4, 4], [5, 6])).toBe(true); // 1 down, 2 right
      expect(isValidKnightMove([4, 4], [5, 2])).toBe(true); // 1 down, 2 left
    });

    test("knight cannot move in straight lines", () => {
      expect(isValidKnightMove([4, 4], [4, 6])).toBe(false); // horizontal
      expect(isValidKnightMove([4, 4], [6, 4])).toBe(false); // vertical
      expect(isValidKnightMove([4, 4], [6, 6])).toBe(false); // diagonal
    });
  });

  describe("King Movement", () => {
    test("king can move one square in any direction", () => {
      expect(isValidKingMove([4, 4], [3, 4])).toBe(true); // up
      expect(isValidKingMove([4, 4], [5, 4])).toBe(true); // down
      expect(isValidKingMove([4, 4], [4, 3])).toBe(true); // left
      expect(isValidKingMove([4, 4], [4, 5])).toBe(true); // right
      expect(isValidKingMove([4, 4], [3, 3])).toBe(true); // up-left
    });

    test("king cannot move more than one square", () => {
      expect(isValidKingMove([4, 4], [4, 6])).toBe(false);
      expect(isValidKingMove([4, 4], [6, 4])).toBe(false);
      expect(isValidKingMove([4, 4], [2, 2])).toBe(false);
    });
  });

  describe("Move Execution", () => {
    test("movePiece should move pieces correctly", () => {
      const board = createBoard();
      board[6][4] = "P"; // e2

      const newBoard = movePiece(board, [6, 4], [5, 4]); // e2-e3

      expect(getPiece(newBoard, [6, 4])).toBe(" ");
      expect(getPiece(newBoard, [5, 4])).toBe("P");
    });

    test("applyMove should handle white pawn promotion", () => {
      const board = createBoard();
      board[1][4] = "P"; // white pawn at e7 (ready to promote)

      const newBoard = applyMove(board, [1, 4], [0, 4]); // e7-e8

      expect(getPiece(newBoard, [0, 4])).toBe("Q"); // promoted to queen
    });

    test("applyMove should handle black pawn promotion", () => {
      const board = createBoard();
      board[6][4] = "p"; // black pawn at e2 (ready to promote)

      const newBoard = applyMove(board, [6, 4], [7, 4]); // e2-e1

      expect(getPiece(newBoard, [7, 4])).toBe("q"); // promoted to queen
    });
  });

  describe("isLegalMove", () => {
    test("should allow legal pawn move", () => {
      const board = setupBoard();
      expect(isLegalMove(board, [6, 4], [5, 4])).toBe(true); // e2-e3
    });

    test("should prevent moving empty square", () => {
      const board = setupBoard();
      expect(isLegalMove(board, [4, 4], [5, 4])).toBe(false); // empty square
    });

    test("should prevent capturing own piece", () => {
      const board = setupBoard();
      expect(isLegalMove(board, [6, 0], [7, 0])).toBe(false); // pawn tries to capture own rook
    });

    test("should allow knight move from initial position", () => {
      const board = setupBoard();
      expect(isLegalMove(board, [7, 1], [5, 2])).toBe(true); // Ng1-f3
    });
  });

  describe("Win Condition - checkWinner", () => {
    test("should return null when both kings are present", () => {
      const board = setupBoard();
      expect(checkWinner(board)).toBe(null);
    });

    test("should detect white wins when black king is captured", () => {
      const board = createBoard();
      // Set up a scenario where black king is missing
      board[7][4] = "K"; // White king
      // Black king is missing (captured)
      board[0][0] = "r"; // Other black pieces still exist
      board[1][0] = "p";

      expect(checkWinner(board)).toBe("White wins!");
    });

    test("should detect black wins when white king is captured", () => {
      const board = createBoard();
      // Set up a scenario where white king is missing
      board[0][4] = "k"; // Black king
      // White king is missing (captured)
      board[7][0] = "R"; // Other white pieces still exist
      board[6][0] = "P";

      expect(checkWinner(board)).toBe("Black wins!");
    });

    test("should detect white wins with only kings on board", () => {
      const board = createBoard();
      board[7][4] = "K"; // White king only
      // No black king

      expect(checkWinner(board)).toBe("White wins!");
    });

    test("should detect black wins with only kings on board", () => {
      const board = createBoard();
      board[0][4] = "k"; // Black king only
      // No white king

      expect(checkWinner(board)).toBe("Black wins!");
    });

    test("should work with empty board except for one king", () => {
      const board = createBoard();
      board[3][3] = "K"; // Only white king on empty board

      expect(checkWinner(board)).toBe("White wins!");
    });

    test("should return null with both kings in non-standard positions", () => {
      const board = createBoard();
      board[2][2] = "K"; // White king
      board[5][5] = "k"; // Black king

      expect(checkWinner(board)).toBe(null);
    });
  });
});
