class Game2048 {
    constructor() {
        this.canvas = document.getElementById('2048Canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('2048Score');
        this.highScoreElement = document.getElementById('2048HighScore');
        this.startButton = document.getElementById('2048StartButton');

        // Configuration du canvas
        this.size = 4;
        this.tileSize = 100;
        this.padding = 10;
        this.canvas.width = this.canvas.height = (this.tileSize + this.padding) * this.size + this.padding;

        // Couleurs des tuiles
        this.colors = {
            '2': '#eee4da',
            '4': '#ede0c8',
            '8': '#f2b179',
            '16': '#f59563',
            '32': '#f67c5f',
            '64': '#f65e3b',
            '128': '#edcf72',
            '256': '#edcc61',
            '512': '#edc850',
            '1024': '#edc53f',
            '2048': '#edc22e'
        };

        this.textColors = {
            '2': '#776e65',
            '4': '#776e65',
            '8': '#f9f6f2',
            '16': '#f9f6f2',
            '32': '#f9f6f2',
            '64': '#f9f6f2',
            '128': '#f9f6f2',
            '256': '#f9f6f2',
            '512': '#f9f6f2',
            '1024': '#f9f6f2',
            '2048': '#f9f6f2'
        };

        this.init();
        this.addEventListeners();
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.highScore = localStorage.getItem('2048HighScore') || 0;
        this.isGameOver = false;
        this.highScoreElement.textContent = this.highScore;
        this.scoreElement.textContent = '0';

        // Ajouter deux tuiles au début
        this.addNewTile();
        this.addNewTile();
        this.draw();
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    draw() {
        this.ctx.fillStyle = '#bbada0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.grid[i][j];
                const x = j * (this.tileSize + this.padding) + this.padding;
                const y = i * (this.tileSize + this.padding) + this.padding;

                // Dessiner la tuile
                this.ctx.fillStyle = value === 0 ? '#cdc1b4' : this.colors[value];
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);

                if (value !== 0) {
                    // Dessiner le nombre
                    this.ctx.fillStyle = this.textColors[value];
                    this.ctx.font = value >= 1000 ? 'bold 36px Arial' : 'bold 48px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(value, x + this.tileSize/2, y + this.tileSize/2);
                }
            }
        }
    }

    move(direction) {
        if (this.isGameOver) return;

        const previousGrid = JSON.stringify(this.grid);
        let moved = false;

        switch(direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addNewTile();
            this.scoreElement.textContent = this.score;

            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('2048HighScore', this.highScore);
                this.highScoreElement.textContent = this.highScore;
            }

            if (!this.canMove()) {
                this.gameOver();
            }
        }

        this.draw();
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            while (row.length < this.size) row.push(0);
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) moved = true;
            this.grid[i] = row;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    row.unshift(0);
                    moved = true;
                }
            }
            while (row.length < this.size) row.unshift(0);
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) moved = true;
            this.grid[i] = row;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            let column = [];
            for (let i = 0; i < this.size; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            while (column.length < this.size) column.push(0);
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== column[i]) moved = true;
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            let column = [];
            for (let i = 0; i < this.size; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    column.unshift(0);
                    moved = true;
                }
            }
            while (column.length < this.size) column.unshift(0);
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== column[i]) moved = true;
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    canMove() {
        // Vérifier s'il y a des cases vides
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) return true;
            }
        }

        // Vérifier s'il y a des mouvements possibles
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                if ((i < this.size - 1 && this.grid[i + 1][j] === current) ||
                    (j < this.size - 1 && this.grid[i][j + 1] === current)) {
                    return true;
                }
            }
        }
        return false;
    }

    gameOver() {
        this.isGameOver = true;
        
        this.ctx.fillStyle = 'rgba(238, 228, 218, 0.73)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#776e65';
        this.ctx.font = 'bold 60px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
        
        this.startButton.textContent = 'Rejouer';
        this.startButton.classList.remove('hidden');

        if (this.score > 0) {
            window.gameLeaderboard.addScore('2048', this.score);
        }
    }

    startGame() {
        this.init();
        this.isGameOver = false;
        this.startButton.classList.add('hidden');
        this.draw();
    }

    addEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());

        document.addEventListener('keydown', (e) => {
            if (this.isGameOver) return;

            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.move('down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.move('right');
                    break;
            }
        });
    }
}

// Initialiser le jeu
const game2048 = new Game2048(); 