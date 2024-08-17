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
      board[row][column].setValue(player);
      return true;
    } else {
      return false;
    }
  };

  const printBoard = () => {
    const boardWithValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
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
  let isGameOver = false;
  let isGameDraw = false;

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
    if (isGameOver) {
    } else {
      let slot = board.pickSlot(row, column, getActivePlayer().token);
      checkSlot(slot);
    }
  };

  const gameOver = () => {
    return isGameOver;
  };

  const gameDraw = () => {
    return isGameDraw;
  };

  const setGameStatus = () => {
    activePlayer = players[0];
    isGameOver = false;
    isGameDraw = false;
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
        return (isGameOver = true);
      } else {
        return (isGameOver = true);
      }
    }

    function isBoardFull(board) {
      return board.every((row) => row.every((cell) => cell !== " "));
    }

    if (isBoardFull(boardCheck)) {
      return (isGameDraw = true);
    }
  };

  return {
    playRound,
    getActivePlayer,
    gameOver,
    gameDraw,
    setGameStatus,
    getBoard: board.getBoard,
    resetBoard: board.resetBoard,
  };
}

// const game = GameController();

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const resetBtn = document.querySelector(".reset");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    let rowIndex = 0;

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    // playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Reset Game Button if Game Over
    if (game.gameOver() || game.gameDraw()) {
      resetBtn.style.display = "block";
    } else {
      resetBtn.style.display = "none";
    }

    // Render board squares
    board.forEach((row) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        if (game.getActivePlayer().token == "X") {
          cellButton.classList.add("xHover");
        } else {
          cellButton.classList.add("oHover");
        }
        if (cell.getValue() == "X") {
          cellButton.classList.add("addXSlot");
        } else if (cell.getValue() == "O") {
          cellButton.classList.add("addOSlot");
        }
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        boardDiv.appendChild(cellButton);
      });
      rowIndex++;
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn || !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  resetBtn.addEventListener("click", () => {
    if (game.gameOver() || game.gameDraw()) {
      game.resetBoard();
      game.setGameStatus();
      updateScreen();
    }
  });

  updateScreen();
}

ScreenController();
