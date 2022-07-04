const gameBoard = (() => {
  let board = [];
  const init = 
    () => {
      board = [[null,null,null],[null,null,null],[null,null,null]];
      for (let square of squares) 
        square.textContent = '';
    }
  const addSymbol = (symbol,row,column) => {
    if (board[row][column] !== null) return false;
    board[row][column] = symbol;
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
    init,
    addSymbol,
    winner,
    draw
  }
})();

const Player = (playerName,symbol) => {
  let score = 0;
  const makeMove = (row,column) => {
    return gameBoard.addSymbol(symbol,row,column);
  }
  const getScore = () => score;
  const getName = () => playerName;
  const getSymbol = () => symbol;
  const resetScore = () => score = 0;
  const incrementScore = () => score++;
  return {makeMove,getScore,getName,getSymbol,resetScore,incrementScore};
}

const gameState = (() => {
  let gameInAction = false;
  let currentPlayer;
  let player1, player2;
  
  const getCurrentPlayer = () => currentPlayer;

  const setupMatch = () => {
    let name1 = prompt("Enter the first player's name (Your symbol is O): ");
    let name2 = prompt("Enter the second player's name (Your symbol is X): ");
    player1 = Player(name1,'O');
    player2 = Player(name2,'X');
    display.player1Name.textContent = name1;
    display.player2Name.textContent = name2;
    display.player1Score.textContent = display.player2Score.textContent = 0;
    newGame();
  }

  const resetScores = () => {
    if (player1 === undefined || player2 === undefined) return;
    player1.resetScore();
    player2.resetScore();
    display.player1Score.textContent = display.player2Score.textContent = 0;
  }

  const newGame = () => {
    if (player1 === undefined || player2 === undefined) {
      display.message.textContent = 
        "You need to click 'Setup Match' before playing";
      return;
    }
    gameBoard.init();
    gameInAction = true;
    currentPlayer = player1;
    display.message.textContent = `${player1.getName()}'s turn`;
  }

  const progress = () => {
    if (gameBoard.winner()) {
      gameInAction = false;
      display.message.textContent = `${currentPlayer.getName()} wins!`;
      currentPlayer.incrementScore();
      let newScore = currentPlayer.getScore();
      if (currentPlayer === player1) 
        display.player1Score.textContent = newScore;
      else
        display.player2Score.textContent = newScore;
    }
    else if (gameBoard.draw()) {
      gameInAction = false;
      display.message.textContent = "It's a draw. Everyone LOSES";
    }
    else {
      currentPlayer = (currentPlayer === player1) ? player2 : player1;
      display.message.textContent = `${currentPlayer.getName()}'s turn`;
    }
  }

  const gameIsInAction = () => gameInAction;

  return {
    gameIsInAction,
    setupMatch,
    getCurrentPlayer,
    progress,
    resetScores,
    newGame
  }
})();

const display = {
  message: document.querySelector('.game-messages'),
  player1Name: document.querySelector('#player1-name'),
  player1Score: document.querySelector('#player1-score'),
  player2Name: document.querySelector('#player2-name'),
  player2Score: document.querySelector('#player2-score')
};

const squares = document.querySelectorAll('.game-board div');

document.querySelector('.setup-match').addEventListener('click',
  () => gameState.setupMatch());
document.querySelector('.new-game').addEventListener('click',
  () => gameState.newGame());
document.querySelector('.reset-scores').addEventListener('click',
  () => gameState.resetScores());


for (let square of squares) {
  let row = +square.dataset['row'];
  let col = +square.dataset['col'];
  square.addEventListener('click', () => {
    if (!gameState.gameIsInAction()) return;
    let currentPlayer = gameState.getCurrentPlayer();
    let currentSymbol = currentPlayer.getSymbol();
    if (currentPlayer.makeMove(row, col)){
      square.textContent = currentSymbol;
      gameState.progress();
    }
  });
}
