class FlappyBird {
    constructor() {
        this.canvas = document.getElementById('flappyCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('flappyScore');
        this.highScoreElement = document.getElementById('flappyHighScore');
        this.startButton = document.getElementById('flappyStartButton');

        // Configuration du canvas
        this.canvas.width = 400;
        this.canvas.height = 600;

        // Configuration du jeu
        this.birdSize = 30;
        this.gravity = 0.15;
        this.jumpForce = -4;
        this.pipeWidth = 60;
        this.pipeGap = 180;
        this.pipeSpacing = 300;
        this.minPipeHeight = 50;
        this.pipeSpeed = 1.5;

        // Couleurs
        this.colors = {
            bird: '#FFD700',
            pipe: '#4CAF50',
            background: '#1a1a2e'
        };

        // Ajout de l'image de l'oiseau en base64
        this.birdImage = new Image();
        this.birdImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAYCAYAAAAMAljuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTM5NzQ5NzY2RDI5MTFFQjk2NEJEQzRFNzYyNjI4MEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTM5NzQ5Nzc2RDI5MTFFQjk2NEJEQzRFNzYyNjI4MEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5Mzk3NDk3NDZEMjkxMUVCOTY0QkRDNEU3NjI2MjgwRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5Mzk3NDk3NTZEMjkxMUVCOTY0QkRDNEU3NjI2MjgwRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAAALAAAAAAwABgAAAj/AAEIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLvx9PnmAAAAA7';

        // Animation de l'oiseau
        this.birdFrames = 1; // On utilise une seule frame pour l'instant
        this.currentFrame = 0;
        this.frameWidth = 100; // Ajuster selon la taille de votre image
        this.frameHeight = 100; // Ajuster selon la taille de votre image
        this.frameInterval = 100;
        this.lastFrameTime = 0;
        this.rotation = 0;

        this.init();
        this.addEventListeners();
    }

    init() {
        this.bird = {
            x: this.canvas.width / 4,
            y: this.canvas.height / 2,
            velocity: 0
        };

        this.pipes = [];
        this.score = 0;
        this.highScore = localStorage.getItem('flappyHighScore') || 0;
        this.isGameRunning = false;
        this.frameId = null;
        this.lastPipeTime = 0;

        this.highScoreElement.textContent = this.highScore;
        this.scoreElement.textContent = '0';

        this.createPipe();
        this.draw();
    }

    createPipe() {
        const minHeight = this.minPipeHeight;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;

        this.pipes.push({
            x: this.canvas.width,
            height: height,
            passed: false
        });
    }

    update() {
        if (!this.isGameRunning) return;

        // Mise à jour de l'oiseau
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        // Collision avec les bords
        if (this.bird.y < 0 || this.bird.y + this.birdSize > this.canvas.height) {
            this.gameOver();
            return;
        }

        // Mise à jour et vérification des tuyaux
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;

            // Collision avec les tuyaux
            if (this.checkCollision(pipe)) {
                this.gameOver();
                return;
            }

            // Score
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score++;
                this.scoreElement.textContent = this.score;
            }

            // Suppression des tuyaux hors écran
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
            }
        }

        // Création de nouveaux tuyaux
        if (this.pipes[this.pipes.length - 1].x < this.canvas.width - this.pipeSpacing) {
            this.createPipe();
        }

        this.draw();
        this.frameId = requestAnimationFrame(() => this.update());
    }

    checkCollision(pipe) {
        const birdRight = this.bird.x + this.birdSize;
        const birdBottom = this.bird.y + this.birdSize;
        
        // Collision avec le tuyau du bas
        if (this.bird.x < pipe.x + this.pipeWidth &&
            birdRight > pipe.x &&
            birdBottom > pipe.height + this.pipeGap) {
            return true;
        }
        
        // Collision avec le tuyau du haut
        if (this.bird.x < pipe.x + this.pipeWidth &&
            birdRight > pipe.x &&
            this.bird.y < pipe.height) {
            return true;
        }

        return false;
    }

    draw() {
        // Fond
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Tuyaux
        this.ctx.fillStyle = this.colors.pipe;
        this.pipes.forEach(pipe => {
            // Tuyau du haut
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.height);
            // Tuyau du bas
            this.ctx.fillRect(
                pipe.x,
                pipe.height + this.pipeGap,
                this.pipeWidth,
                this.canvas.height - (pipe.height + this.pipeGap)
            );
        });

        // Dessiner l'oiseau avec rotation
        this.ctx.save();
        this.ctx.translate(
            this.bird.x + this.birdSize/2,
            this.bird.y + this.birdSize/2
        );
        
        // Rotation basée sur la vélocité
        this.rotation = Math.min(Math.PI/4, Math.max(-Math.PI/4, this.bird.velocity * 0.1));
        this.ctx.rotate(this.rotation);

        // Dessiner le corps de l'oiseau
        this.ctx.fillStyle = '#FFD700'; // Jaune
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, this.birdSize/2, this.birdSize/3, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Dessiner l'aile
        this.ctx.fillStyle = '#FFA500'; // Orange
        this.ctx.beginPath();
        this.ctx.ellipse(-5, 0, this.birdSize/4, this.birdSize/6, Math.PI/4, 0, Math.PI * 2);
        this.ctx.fill();

        // Dessiner la tête
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(this.birdSize/3, -this.birdSize/6, this.birdSize/4, 0, Math.PI * 2);
        this.ctx.fill();

        // Dessiner le bec
        this.ctx.fillStyle = '#FF6B6B'; // Rouge clair
        this.ctx.beginPath();
        this.ctx.moveTo(this.birdSize/2, -this.birdSize/6);
        this.ctx.lineTo(this.birdSize/1.5, -this.birdSize/8);
        this.ctx.lineTo(this.birdSize/2, -this.birdSize/12);
        this.ctx.closePath();
        this.ctx.fill();

        // Dessiner l'œil
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.birdSize/2.5, -this.birdSize/5, this.birdSize/10, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    jump() {
        if (this.isGameRunning) {
            this.bird.velocity = this.jumpForce;
        }
    }

    startGame() {
        if (this.isGameRunning) return;
        
        this.init();
        this.isGameRunning = true;
        this.startButton.classList.add('hidden');
        this.update();
    }

    gameOver() {
        this.isGameRunning = false;
        cancelAnimationFrame(this.frameId);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('flappyHighScore', this.highScore);
            this.highScoreElement.textContent = this.highScore;
        }

        if (this.score > 0) {
            window.gameLeaderboard.addScore('flappy', this.score);
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

    addEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        
        // Saut avec la barre d'espace
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.jump();
            }
        });

        // Saut avec le clic de souris
        this.canvas.addEventListener('click', () => this.jump());
    }
}

// Initialiser le jeu
const flappyBird = new FlappyBird(); 