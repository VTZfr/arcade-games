class Tetris {
    constructor() {
        this.canvas = document.getElementById('tetrisCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('tetrisScore');
        this.linesElement = document.getElementById('tetrisLines');
        this.startButton = document.getElementById('tetrisStartButton');

        // Configuration du canvas
        this.blockSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.canvas.width = this.blockSize * this.cols;
        this.canvas.height = this.blockSize * this.rows;

        // Couleurs des pièces
        this.colors = {
            'I': '#00f0f0',
            'O': '#f0f000',
            'T': '#a000f0',
            'S': '#00f000',
            'Z': '#f00000',
            'J': '#0000f0',
            'L': '#f0a000'
        };

        // Formes des pièces
        this.shapes = {
            'I': [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
            'O': [[1,1], [1,1]],
            'T': [[0,1,0], [1,1,1], [0,0,0]],
            'S': [[0,1,1], [1,1,0], [0,0,0]],
            'Z': [[1,1,0], [0,1,1], [0,0,0]],
            'J': [[1,0,0], [1,1,1], [0,0,0]],
            'L': [[0,0,1], [1,1,1], [0,0,0]]
        };

        this.init();
        this.addEventListeners();
    }

    init() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.lines = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        
        this.scoreElement.textContent = '0';
        this.linesElement.textContent = '0';
        
        this.currentPiece = null;
        this.createNewPiece();
    }

    createNewPiece() {
        const pieces = 'IOTSZJL';
        const type = pieces[Math.floor(Math.random() * pieces.length)];
        this.currentPiece = {
            type: type,
            matrix: this.shapes[type],
            pos: {x: Math.floor(this.cols/2) - Math.floor(this.shapes[type][0].length/2), y: 0},
            color: this.colors[type]
        };

        if (this.collision()) {
            this.gameOver();
        }
    }

    rotate() {
        // Sauvegarder la position et la matrice originale
        const originalX = this.currentPiece.pos.x;
        const originalY = this.currentPiece.pos.y;
        const originalMatrix = [...this.currentPiece.matrix.map(row => [...row])];
        
        // Effectuer la rotation
        const rotated = this.rotateMatrix(this.currentPiece.matrix);
        this.currentPiece.matrix = rotated;
        
        // Essayer différentes positions si la rotation cause une collision
        const positions = [0, -1, 1, -2, 2]; // Positions à essayer
        
        for (let testOffset of positions) {
            this.currentPiece.pos.x = originalX + testOffset;
            if (!this.collision()) {
                return; // Position valide trouvée
            }
        }
        
        // Si aucune position ne fonctionne, revenir à l'état original
        this.currentPiece.pos.x = originalX;
        this.currentPiece.pos.y = originalY;
        this.currentPiece.matrix = originalMatrix;
    }

    rotateMatrix(matrix) {
        const N = matrix.length;
        const rotated = Array(N).fill().map(() => Array(N).fill(0));
        
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                rotated[x][N - 1 - y] = matrix[y][x];
            }
        }
        
        return rotated;
    }

    collision() {
        const matrix = this.currentPiece.matrix;
        const pos = this.currentPiece.pos;
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] !== 0) {
                    const newY = y + pos.y;
                    const newX = x + pos.x;
                    
                    if (newX < 0 || newX >= this.cols || 
                        newY >= this.rows ||
                        (newY >= 0 && this.grid[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    merge() {
        this.currentPiece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.grid[y + this.currentPiece.pos.y][x + this.currentPiece.pos.x] = this.currentPiece.type;
                }
            });
        });
    }

    clearLines() {
        let linesCleared = 0;
        
        outer: for (let y = this.grid.length - 1; y >= 0; y--) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === 0) {
                    continue outer;
                }
            }
            
            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(row);
            linesCleared++;
            y++;
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * linesCleared; // Bonus pour les lignes multiples
            this.scoreElement.textContent = this.score;
            this.linesElement.textContent = this.lines;
            this.dropInterval = Math.max(200, 1000 - (this.lines * 50)); // Augmentation de la vitesse
        }
    }

    draw() {
        // Effacer le canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner la grille
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.ctx.fillStyle = this.colors[value];
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, 
                                    this.blockSize - 1, this.blockSize - 1);
                }
            });
        });

        // Dessiner la pièce courante
        if (this.currentPiece) {
            this.currentPiece.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        this.ctx.fillStyle = this.currentPiece.color;
                        this.ctx.fillRect((x + this.currentPiece.pos.x) * this.blockSize,
                                        (y + this.currentPiece.pos.y) * this.blockSize,
                                        this.blockSize - 1, this.blockSize - 1);
                    }
                });
            });
        }
    }

    drop() {
        this.currentPiece.pos.y++;
        if (this.collision()) {
            this.currentPiece.pos.y--;
            this.merge();
            this.clearLines();
            this.createNewPiece();
        }
        this.dropCounter = 0;
    }

    move(dir) {
        this.currentPiece.pos.x += dir;
        if (this.collision()) {
            this.currentPiece.pos.x -= dir;
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.draw();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '2em Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
        
        this.startButton.textContent = 'Rejouer';
        this.startButton.classList.remove('hidden');
        
        if (this.score > 0) {
            window.gameLeaderboard.addScore('tetris', this.score);
        }
    }

    update(time = 0) {
        if (this.isGameOver || this.isPaused) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += deltaTime;

        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }

        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
        this.startButton.addEventListener('click', () => {
            this.init();
            this.isGameOver = false;
            this.startButton.classList.add('hidden');
            this.update();
        });

        document.addEventListener('keydown', (e) => {
            if (this.isGameOver) return;

            // Empêcher le défilement de la page avec les flèches
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
            }

            switch(e.key) {
                case 'ArrowLeft':
                    this.move(-1);
                    break;
                case 'ArrowRight':
                    this.move(1);
                    break;
                case 'ArrowDown':
                    this.drop();
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case ' ':
                    e.preventDefault(); // Empêcher aussi le défilement avec la barre d'espace
                    while (!this.collision()) {
                        this.currentPiece.pos.y++;
                    }
                    this.currentPiece.pos.y--;
                    this.merge();
                    this.clearLines();
                    this.createNewPiece();
                    break;
            }
        });
    }
}

// Initialiser le jeu
const tetris = new Tetris(); 