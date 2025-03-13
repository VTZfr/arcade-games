class Leaderboard {
    constructor() {
        this.maxEntries = 5;
        this.games = ['snake', 'pong', 'tetris', 'flappy', '2048'];
        this.scores = {};
        
        // Initialiser les scores pour chaque jeu
        this.games.forEach(game => {
            this.scores[game] = JSON.parse(localStorage.getItem(`${game}Scores`)) || [];
        });
        
        // Afficher les scores initiaux
        this.updateDisplay();
    }

    addScore(game, score, playerName = 'Joueur') {
        if (!this.scores[game]) {
            this.scores[game] = [];
        }
        
        this.scores[game].push({ name: playerName, score: score });
        this.scores[game].sort((a, b) => b.score - a.score);
        this.scores[game] = this.scores[game].slice(0, this.maxEntries);
        
        // Sauvegarder dans le localStorage
        localStorage.setItem(`${game}Scores`, JSON.stringify(this.scores[game]));
        
        this.updateDisplay();
    }

    updateDisplay() {
        this.games.forEach(game => {
            const leaderboard = document.getElementById(`${game}-leaderboard`);
            if (leaderboard) {
                leaderboard.innerHTML = this.scores[game]
                    .map((entry, index) => `<li>${entry.name}: ${entry.score}</li>`)
                    .join('');
            }
        });
    }

    showGame(gameName) {
        this.games.forEach(game => {
            const scores = document.getElementById(`${game}-scores`);
            if (scores) {
                scores.classList.toggle('hidden', game !== gameName);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gameButtons = document.querySelectorAll('.game-btn');
    const games = document.querySelectorAll('.game-container');
    const controls = document.querySelectorAll('.controls-info');
    const leaderboard = new Leaderboard();

    function switchGame(gameName) {
        // Cacher tous les jeux et contrôles
        games.forEach(game => game.classList.add('hidden'));
        controls.forEach(control => control.classList.add('hidden'));
        
        // Afficher le jeu sélectionné et ses contrôles
        document.getElementById(`${gameName}-game`).classList.remove('hidden');
        document.getElementById(`${gameName}-controls`).classList.remove('hidden');
        
        // Mettre à jour les boutons
        gameButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.game === gameName);
        });

        leaderboard.showGame(gameName);
    }

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchGame(button.dataset.game);
        });
    });

    // Exposer le leaderboard globalement pour y accéder depuis les jeux
    window.gameLeaderboard = leaderboard;
}); 