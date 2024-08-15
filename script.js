function GameBoard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  const getBoard = () => board;

  const pickSlot = (row, column, player) => {
    if (board[row][column].getValue() == " ") {
      console.log(`Dropping token into row ${row} & column ${column}`);
      board[row][column].setValue(player);
      return true;
    } else {
      console.log("Slot already chosen, Please choose another cell!");
      return false;
    }
  };

  const printBoard = () => {
    const boardWithValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithValues);
    return boardWithValues;
  };

  return { getBoard, printBoard, pickSlot, resetBoard };
}

const board = GameBoard();
board.printBoard();

function Cell() {
  let value = " ";

  // Accept a player's token to change the value of the cell
  const setValue = (player) => {
    value = player;
  };
  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    setValue,
    getValue,
  };
}

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
  const board = GameBoard();

  const players = [
    {
      name: playerOne,
      token: "X",
    },
    {
      name: playerTwo,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    let boardCheck = board.printBoard();
    checkWinner(boardCheck, getActivePlayer().token);
  };

  const playRound = (row, column) => {
    let slot = board.pickSlot(row, column, getActivePlayer().token);
    checkSlot(slot);
  };

  const checkSlot = (slot) => {
    if (slot) {
      printNewRound();
      switchPlayerTurn();
    } else {
      printNewRound();
    }
  };

  const checkWinner = (boardCheck, token) => {
    if (
      (boardCheck[0][0] == token &&
        boardCheck[0][1] == token &&
        boardCheck[0][2] == token) ||
      (boardCheck[1][0] == token &&
        boardCheck[1][1] == token &&
        boardCheck[1][2] == token) ||
      (boardCheck[2][0] == token &&
        boardCheck[2][1] == token &&
        boardCheck[2][2] == token) ||
      (boardCheck[0][0] == token &&
        boardCheck[1][0] == token &&
        boardCheck[2][0] == token) ||
      (boardCheck[0][1] == token &&
        boardCheck[1][1] == token &&
        boardCheck[2][1] == token) ||
      (boardCheck[0][2] == token &&
        boardCheck[1][2] == token &&
        boardCheck[2][2] == token) ||
      (boardCheck[0][0] == token &&
        boardCheck[1][1] == token &&
        boardCheck[2][2] == token) ||
      (boardCheck[0][2] == token &&
        boardCheck[1][1] == token &&
        boardCheck[2][0] == token)
    ) {
      if (token == "X") {
        console.log("Player One Winner!");
        board.resetBoard();
        board.printBoard();
        return;
      } else {
        console.log("Player Two Winner!");
        board.resetBoard();
        board.printBoard();
        return;
      }
    }

    function isBoardFull(board) {
      return board.every((row) => row.every((cell) => cell !== " "));
    }

    if (isBoardFull(boardCheck)) {
      console.log("Its a Draw!");
      board.resetBoard();
      board.printBoard();
    }
  };

  return { playRound, getActivePlayer };
}

const game = GameController();
