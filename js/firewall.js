// Setting up the the grid for the maze game for the user
const mazeSize = 10;
const mazeContainer = document.getElementById('maze-container');
let playerPosition = { x: 0, y: 0 }; // Starting position
let gameOver = false;

// the mazea structure 1 for wall 0 for open path
const maze = generateMaze(mazeSize);

// Creating the maze to implement into the html
function createMaze() {
  mazeContainer.innerHTML = ''; // Clear previous maze
  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('maze-cell');
      if (maze[y][x] === 1) cell.classList.add('wall');
      if (x === playerPosition.x && y === playerPosition.y) cell.classList.add('player');
      mazeContainer.appendChild(cell);
    }
  }
}

// simple maze generation. (first draft/demo)
function generateMaze(size) {
  const maze = Array.from({ length: size }, () => Array(size).fill(0));

  // Add walls randomly
  for (let i = 0; i < size * 2; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    maze[y][x] = 1;
  }

  // making sure the start and end of the maze are open
  maze[0][0] = 0;
  maze[size - 1][size - 1] = 0;

  return maze;
}

// Moveing the player depending on the actions of the user
function movePlayer(event) {
  if (gameOver) return;

  let newX = playerPosition.x;
  let newY = playerPosition.y;

  if (event.key === 'ArrowUp') newY--;
  if (event.key === 'ArrowDown') newY++;
  if (event.key === 'ArrowLeft') newX--;
  if (event.key === 'ArrowRight') newX++;

  // Cboundariies and wall checking. making sure it is there
  if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
    playerPosition = { x: newX, y: newY };
  }

  // making sure the player reached the end. checking point
  if (playerPosition.x === mazeSize - 1 && playerPosition.y === mazeSize - 1) {
    gameOver = true;
    showGameStatus('You Win! You escaped the firewall!');
  }

  // registrering any collisons with the walls of the maze
  if (maze[playerPosition.y][playerPosition.x] === 1) {
    gameOver = true;
    showGameStatus('Game Over! You hit a firewall!');
  }

  createMaze(); // Re-render the maze
}

// Show win or loss messafes
function showGameStatus(message) {
  const statusElement = document.createElement('div');
  statusElement.classList.add('game-status');
  statusElement.textContent = message;
  document.body.appendChild(statusElement);
}

// set up of the game
function startGame() {
  createMaze();
  window.addEventListener('keydown', movePlayer);
}

// game start at the beginning of the page
startGame();
