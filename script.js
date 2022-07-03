const gameBoard = (()=>{
  let board = [];
  const init = 
    () => board = [[null,null,null],[null,null,null],[null,null,null]];
  const addSymbol = (symbol,row,column) => {
    if (board[row,column] === null) return false;
    board[row,column] = symbol;
    return true;
  }
  const winner = () => {
    for(let row = 0; row < 3; row++){
      let first = board[row][0];
      if(first !== null && first === board[row][1] && first === board[row][2])
        return first;
    }

    for(let col = 0; col < 3; col++){
      let first = board[0][col];
      if(first !== null && first === board[1][col] && first === board[2][col])
        return first;
    }

    let middle = board[1][1];
    if(middle !== null && 
        ((middle === board[0][0] && middle === board[2][2]) ||
         (middle === board[0][2] && middle === board[2][0])))
      return middle;
    return false;
  }
  const draw = () => {
    for (row of board)
      for (square of row)
        if (square === null) return false;
    return true;
  }
  return {
    addSymbol,
    winner,
    draw
  }
})();

const Player = (playerName,symbol) => {
  let wins = 0;
  const makeMove = (row,column) => gameBoard.addSymbol(symbol,row,column);
  const getWins = () => wins;
  const getName = () => playerName;
  const getSymbol = () => symbol;
  const resetWins = () => wins = 0;
  return {makeMove,getWins,getName,resetWins};
}

const game = (()=>{
  let gamePlaying = false;
  let currentPlayer;
  let player1, player2;
  const setPlayers = () => {
    let name1 = prompt("Enter the first player's name (Your symbol is O): ");
    let name2 = prompt("Enter the second player's name (Your symbol is X): ");
    player1 = Player(name1,'O');
    player2 = Player(name2,'X');
  }
  const newRound = () => {
    player1.resetWins();
    player2.resetWins();
    newGame();
  }
  const newGame = () => {
    gameBoard.init();
    currentPlayer = player1;
  }
  const progress = (squareClicked) => {
    let moveSuccessful = gameBoard.addSymbol(currentPlayer.getSymbol(),
      squareClicked.row,squareClicked.col);

    if (!moveSuccessful) display.showError('Invalid move');
    display.addSymbol(currentPlayer.getSymbol(),
      squareClicked.row,squareClicked.col);

    if (gameBoard.winner()) 
      display.showResult(`${currentPlayer.getName()} wins!`);
    else if (gameBoard.draw())
      display.showResult("It's a draw. Everyone LOSES");
    else
      currentPlayer = (currentPlayer === player1) ? player2 : player1;
  }
})();