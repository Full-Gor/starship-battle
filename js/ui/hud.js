// hud.js - Interface en jeu

const HUD = {
    initializeLives: function() {
        const team1LivesContainer = document.getElementById('team1Lives');
        const team2LivesContainer = document.getElementById('team2Lives');
        
        team1LivesContainer.innerHTML = '';
        team2LivesContainer.innerHTML = '';
        
        for (let i = 0; i < GameState.players[0].lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.classList.add('life-icon');
            team1LivesContainer.appendChild(lifeIcon);
        }
        
        for (let i = 0; i < GameState.players[1].lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.classList.add('life-icon');
            team2LivesContainer.appendChild(lifeIcon);
        }
    },
    
    updateScoreBoard: function() {
        // Noms des équipes
        document.getElementById('team1Name').textContent = 
            GameState.myPlayerIndex === 0 ? GameState.myPseudo : GameState.opponentPseudo;
        document.getElementById('team2Name').textContent = 
            GameState.myPlayerIndex === 0 ? GameState.opponentPseudo : GameState.myPseudo;
        
        // Scores
        document.getElementById('team1Score').textContent = GameState.players[0].gamesWon;
        document.getElementById('team2Score').textContent = GameState.players[1].gamesWon;
    },
    
    updateRedPoints: function(playerIndex) {
        const player = GameState.players[playerIndex];
        const elementId = `p${playerIndex + 1}RedPoints`;
        const element = document.getElementById(elementId);
        
        if (element) {
            element.textContent = player.redPointsCollected;
            
            // Animation de collecte
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Mise à jour du texte complet
        const counterElement = document.getElementById(`team${playerIndex + 1}Points`);
        if (counterElement) {
            counterElement.querySelector('span').textContent = 
                `POINTS ROUGES: ${player.redPointsCollected} / ${CONSTANTS.RED_POINTS_FOR_SHIELD}`;
        }
    },
    
    resetRedPoints: function() {
        document.getElementById('p1RedPoints').textContent = '0';
        document.getElementById('p2RedPoints').textContent = '0';
        document.getElementById('team1Points').querySelector('span').textContent = 'POINTS ROUGES: 0 / 25';
        document.getElementById('team2Points').querySelector('span').textContent = 'POINTS ROUGES: 0 / 25';
    },
    
    updateNetworkStatus: function(status, latency = null) {
        const statusElement = document.getElementById('statusText');
        if (latency !== null) {
            statusElement.textContent = `${status} (${latency}ms)`;
            
            // Couleur selon la latence
            if (latency < 50) {
                statusElement.style.color = '#00ff00';
            } else if (latency < 100) {
                statusElement.style.color = '#ffff00';
            } else {
                statusElement.style.color = '#ff0000';
            }
        } else {
            statusElement.textContent = status;
        }
    },
    
    showNotification: function(text, color = '#04fbac', duration = 2000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: ${color};
            padding: 15px 30px;
            border-radius: 10px;
            border: 2px solid ${color};
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut ${duration}ms ease-in-out;
        `;
        notification.textContent = text;
        
        // Animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, duration);
    }
};