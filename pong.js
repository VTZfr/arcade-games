class Pong {
    constructor() {
        this.canvas = document.getElementById('pongCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreP1 = document.getElementById('player1Score');
        this.scoreP2 = document.getElementById('player2Score');
        this.startButton = document.getElementById('pongStartButton');

        // Configuration du canvas
        this.canvas.width = 800;
        this.canvas.height = 400;

        // Configuration du jeu
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        this.ballSize = 10;
        this.paddleSpeed = 5;
        this.ballSpeed = 5;

        // État du jeu
        this.isRunning = false;
        this.gameInterval = null;

        // Initialisation
        this.init();
        this.addEventListeners();
    }

    init() {
        // Position des raquettes
        this.paddle1 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0
        };
        this.paddle2 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0
        };

        // Position et vitesse de la balle
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            dx: this.ballSpeed,
            dy: 0
        };

        // Touches pressées
        this.keys = {
            w: false,
            s: false,
            ArrowUp: false,
            ArrowDown: false
        };

        this.drawGame();
    }

    addEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());

        document.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }

    startGame() {
        if (this.isRunning) return;
        
        this.init();
        this.isRunning = true;
        this.startButton.classList.add('hidden');
        this.gameInterval = setInterval(() => this.update(), 1000/60);
    }

    update() {
        // Mouvement des raquettes
        if (this.keys.w && this.paddle1.y > 0) {
            this.paddle1.y -= this.paddleSpeed;
        }
        if (this.keys.s && this.paddle1.y < this.canvas.height - this.paddleHeight) {
            this.paddle1.y += this.paddleSpeed;
        }
        if (this.keys.ArrowUp && this.paddle2.y > 0) {
            this.paddle2.y -= this.paddleSpeed;
        }
        if (this.keys.ArrowDown && this.paddle2.y < this.canvas.height - this.paddleHeight) {
            this.paddle2.y += this.paddleSpeed;
        }

        // Mouvement de la balle
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Collision avec les raquettes
        if (this.ball.x <= this.paddleWidth && 
            this.ball.y >= this.paddle1.y && 
            this.ball.y <= this.paddle1.y + this.paddleHeight) {
            this.ball.dx = this.ballSpeed;
            this.ball.dy = ((this.ball.y - (this.paddle1.y + this.paddleHeight/2)) / (this.paddleHeight/2)) * this.ballSpeed;
        }

        if (this.ball.x >= this.canvas.width - this.paddleWidth && 
            this.ball.y >= this.paddle2.y && 
            this.ball.y <= this.paddle2.y + this.paddleHeight) {
            this.ball.dx = -this.ballSpeed;
            this.ball.dy = ((this.ball.y - (this.paddle2.y + this.paddleHeight/2)) / (this.paddleHeight/2)) * this.ballSpeed;
        }

        // Collision avec les murs
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy = -this.ball.dy;
        }

        // Score
        if (this.ball.x < 0) {
            this.paddle2.score++;
            this.scoreP2.textContent = this.paddle2.score;
            this.resetBall(1);
        } else if (this.ball.x > this.canvas.width) {
            this.paddle1.score++;
            this.scoreP1.textContent = this.paddle1.score;
            this.resetBall(-1);
        }

        this.drawGame();
    }

    resetBall(direction) {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = this.ballSpeed * direction;
        this.ball.dy = 0;
    }

    drawGame() {
        // Effacer le canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner la ligne centrale
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Dessiner les raquettes
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, this.paddle1.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.paddle2.y, this.paddleWidth, this.paddleHeight);

        // Dessiner la balle
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ballSize/2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    stopGame() {
        this.isRunning = false;
        clearInterval(this.gameInterval);
        this.startButton.classList.remove('hidden');
        this.startButton.textContent = 'Rejouer';
        
        const maxScore = Math.max(this.paddle1.score, this.paddle2.score);
        if (maxScore > 0) {
            window.gameLeaderboard.addScore('pong', maxScore);
        }
    }
}

// Initialiser le jeu
const pong = new Pong(); 