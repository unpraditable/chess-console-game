# Chess Console Game

A console-based chess game implemented in Node.js with full chess rules validation and unit testing.

## Features

- Standard 8x8 chess board with proper piece setup
- Legal move validation for all pieces (Pawn, Rook, Knight, Bishop, Queen, King)
- Win condition detection (king capture)
- Pawn promotion to Queen
- Input validation and error handling
- Unit tests

## Limitations

- No _en passant_
- No castling
- For simplicity, promoted pawn will be promoted automaticly to queen
- No checkmate for win condition, just capture the king

## Piece Symbols

- **P** - Pawn
- **R** - Rook
- **H** - Knight (Horse)
- **B** - Bishop
- **Q** - Queen
- **K** - King

_White pieces are uppercase, black pieces are lowercase_

## Installation

1. Ensure you have Node.js installed
2. Clone or download the chess files
3. No additional dependencies required for basic gameplay

## How to Run Unit Tests

1. You must install jest first

```bash
npm install --save-dev jest
```

2. Run

```bash
npm test
```

### Start the Game:

```bash
node chess.js
```

## How to Play

- Input the coordinate from and to in format: (rank)(file), from start to the target (example: a4 b5)
- The game will tell use the illegal moves instead
