class Snake {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('scoreValue');
        this.highScoreElement = document.getElementById('highScoreValue');
        this.startButton = document.getElementById('startButton');

        // Configuration du jeu
        this.gridSize = 20;
        this.tileCount = 20;
        this.canvas.width = this.canvas.height = this.gridSize * this.tileCount;

        // Variables du jeu
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameSpeed = 100;
        this.gameInterval = null;
        this.isGameRunning = false;
        this.powerUps = ['🍎', '⭐', '🌟']; // Différents types de bonus
        this.currentPowerUp = null;
        this.powerUpTimer = 0;
        this.obstacles = [];

        this.highScoreElement.textContent = this.highScore;

        // Couleurs et styles
        this.colors = {
            snake: {
                head: '#4CAF50',
                body: '#8BC34A',
                border: '#2E7D32',
                eye: 'white',
                pupil: 'black'
            },
            food: {
                fill: '#FF5252',
                border: '#D32F2F'
            }
        };

        this.init();
        this.addEventListeners();
        this.generateObstacles();
    }

    init() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    generatePowerUp() {
        if (Math.random() < 0.1 && !this.currentPowerUp) { // 10% de chance
            this.currentPowerUp = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount),
                type: this.powerUps[Math.floor(Math.random() * this.powerUps.length)]
            };
        }
    }

    generateObstacles() {
        for (let i = 0; i < 5; i++) {
            this.obstacles.push({
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            });
        }
    }

    startGame() {
        if (this.isGameRunning) return;
        
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.gameSpeed = 100;
        
        this.isGameRunning = true;
        this.startButton.classList.add('hidden');
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
    }

    gameOver() {
        this.isGameRunning = false;
        clearInterval(this.gameInterval);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.highScoreElement.textContent = this.highScore;
        }
        
        if (this.score > 0) {
            window.gameLeaderboard.addScore('snake', this.score);
        }
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2 - 30);
        this.ctx.font = '20px Poppins';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 10);
        
        this.startButton.textContent = 'Rejouer';
        this.startButton.classList.remove('hidden');
    }

    update() {
        if (this.dx === 0 && this.dy === 0) return;
        
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        if (this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        if (this.obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        if (this.currentPowerUp) {
            if (head.x === this.currentPowerUp.x && head.y === this.currentPowerUp.y) {
                switch(this.currentPowerUp.type) {
                    case '⭐':
                        this.score += 50; // Bonus de points
                        break;
                    case '🌟':
                        this.gameSpeed = Math.max(50, this.gameSpeed - 10); // Accélération
                        break;
                    case '🍎':
                        this.snake.push({}); // Double croissance
                        this.snake.push({});
                        break;
                }
                this.currentPowerUp = null;
            }
        } else {
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10;
                this.scoreElement.textContent = this.score;
                this.food = this.generateFood();
                if (this.gameSpeed > 50) {
                    clearInterval(this.gameInterval);
                    this.gameSpeed -= 2;
                    this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
                }
            } else {
                this.snake.pop();
            }
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner la grille
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Dessiner le serpent
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            const isHead = i === 0;
            
            this.drawSnakeSegment(segment.x, segment.y, isHead, { dx: this.dx, dy: this.dy });
            
            if (i < this.snake.length - 1) {
                const nextSegment = this.snake[i + 1];
                const startX = segment.x * this.gridSize + this.gridSize/2;
                const startY = segment.y * this.gridSize + this.gridSize/2;
                const endX = nextSegment.x * this.gridSize + this.gridSize/2;
                const endY = nextSegment.y * this.gridSize + this.gridSize/2;
                
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.strokeStyle = this.colors.snake.body;
                this.ctx.lineWidth = this.gridSize - 4;
                this.ctx.stroke();
            }
        }
        
        // Dessiner la nourriture
        this.drawFood();
    }

    drawSnakeSegment(x, y, isHead, direction) {
        const radius = this.gridSize / 2;
        const centerX = x * this.gridSize + radius;
        const centerY = y * this.gridSize + radius;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
        this.ctx.fillStyle = isHead ? this.colors.snake.head : this.colors.snake.body;
        this.ctx.fill();
        this.ctx.strokeStyle = this.colors.snake.border;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        if (isHead) {
            const eyeRadius = radius / 4;
            const pupilRadius = eyeRadius / 2;
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

            if (direction.dx === 1) {
                leftEyeX = centerX + radius/3;
                leftEyeY = centerY - radius/3;
                rightEyeX = centerX + radius/3;
                rightEyeY = centerY + radius/3;
            } else if (direction.dx === -1) {
                leftEyeX = centerX - radius/3;
                leftEyeY = centerY - radius/3;
                rightEyeX = centerX - radius/3;
                rightEyeY = centerY + radius/3;
            } else if (direction.dy === -1) {
                leftEyeX = centerX - radius/3;
                leftEyeY = centerY - radius/3;
                rightEyeX = centerX + radius/3;
                rightEyeY = centerY - radius/3;
            } else if (direction.dy === 1) {
                leftEyeX = centerX - radius/3;
                leftEyeY = centerY + radius/3;
                rightEyeX = centerX + radius/3;
                rightEyeY = centerY + radius/3;
            } else {
                leftEyeX = centerX + radius/3;
                leftEyeY = centerY - radius/3;
                rightEyeX = centerX + radius/3;
                rightEyeY = centerY + radius/3;
            }

            [{ x: leftEyeX, y: leftEyeY }, { x: rightEyeX, y: rightEyeY }].forEach(eye => {
                this.ctx.beginPath();
                this.ctx.arc(eye.x, eye.y, eyeRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = this.colors.snake.eye;
                this.ctx.fill();
                this.ctx.strokeStyle = this.colors.snake.border;
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(eye.x, eye.y, pupilRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = this.colors.snake.pupil;
                this.ctx.fill();
            });
        }
    }

    drawFood() {
        const radius = this.gridSize / 2;
        const centerX = this.food.x * this.gridSize + radius;
        const centerY = this.food.y * this.gridSize + radius;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors.food.fill;
        this.ctx.fill();
        this.ctx.strokeStyle = this.colors.food.border;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    gameLoop() {
        this.update();
        this.draw();
    }

    addEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());

        document.addEventListener('keydown', (e) => {
            if (!this.isGameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy === 0) { this.dx = 0; this.dy = -1; }
                    break;
                case 'ArrowDown':
                    if (this.dy === 0) { this.dx = 0; this.dy = 1; }
                    break;
                case 'ArrowLeft':
                    if (this.dx === 0) { this.dx = -1; this.dy = 0; }
                    break;
                case 'ArrowRight':
                    if (this.dx === 0) { this.dx = 1; this.dy = 0; }
                    break;
            }
        });
    }
}

// Initialiser le jeu
const snake = new Snake(); 