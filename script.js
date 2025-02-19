const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const levelDisplay = document.getElementById('level');

let level = 1;
let mazeSize = 10;
let cellSize = canvas.width / mazeSize;
let player = { x: 0, y: 0 };
let exit = { x: mazeSize - 1, y: mazeSize - 1 };
let maze = [];

function generateMaze(size) {
    const maze = new Array(size);
    for (let i = 0; i < size; i++) {
        maze[i] = new Array(size).fill(1);
    }

    function carve(x, y) {
        maze[x][y] = 0;
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ].sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size && maze[nx][ny] === 1) {
                maze[x + dx][y + dy] = 0;
                carve(nx, ny);
            }
        }
    }

    carve(0, 0);
    return maze;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < mazeSize; x++) {
        for (let y = 0; y < mazeSize; y++) {
            if (maze[x][y] === 1) {
                ctx.fillStyle = '#000';
                ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
            }
        }
    }

    // Draw player
    ctx.fillStyle = '#00f';
    ctx.fillRect(player.y * cellSize, player.x * cellSize, cellSize, cellSize);

    // Draw exit
    ctx.fillStyle = '#f00';
    ctx.fillRect(exit.y * cellSize, exit.x * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newX][newY] === 0) {
        player.x = newX;
        player.y = newY;
        if (player.x === exit.x && player.y === exit.y) {
            level++;
            levelDisplay.textContent = level;
            mazeSize += 2; // Increase maze size for the next level
            cellSize = canvas.width / mazeSize;
            maze = generateMaze(mazeSize);
            player = { x: 0, y: 0 };
            exit = { x: mazeSize - 1, y: mazeSize - 1 };
        }
        drawMaze();
    }
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': movePlayer(-1, 0); break;
        case 'ArrowDown': movePlayer(1, 0); break;
        case 'ArrowLeft': movePlayer(0, -1); break;
        case 'ArrowRight': movePlayer(0, 1); break;
    }
});

// Initialize the first level
maze = generateMaze(mazeSize);
drawMaze();
