// gameover.js - Écran de fin de partie

const GameOver = {
    show: function(winnerIndex) {
        const winnerPseudo = winnerIndex === GameState.myPlayerIndex ? 
            GameState.myPseudo : GameState.opponentPseudo;
        
        const gameOverMessage = document.getElementById('gameOverMessage');
        gameOverMessage.style.display = 'block';
        gameOverMessage.innerHTML = '';
        
        // Titre de victoire
        const title = document.createElement('h2');
        title.textContent = `Victoire de ${winnerPseudo} !`;
        title.style.color = winnerIndex === 0 ? CONSTANTS.TEAM1_COLOR : CONSTANTS.TEAM2_COLOR;
        title.style.marginBottom = '10px';
        gameOverMessage.appendChild(title);
        
        // Score
        const score = document.createElement('p');
        score.textContent = `Parties gagnées : ${GameState.players[winnerIndex].gamesWon}`;
        score.style.fontSize = '18px';
        score.style.marginBottom = '20px';
        gameOverMessage.appendChild(score);
        
        // Statistiques de la partie
        const stats = document.createElement('div');
        stats.style.cssText = 'text-align: left; margin: 20px 0;';
        stats.innerHTML = `
            <p><strong>Statistiques de la partie :</strong></p>
            <p>Durée : ${this.getGameDuration()}</p>
            <p>Impacts reçus : ${GameState.players[0].impacts} vs ${GameState.players[1].impacts}</p>
        `;
        gameOverMessage.appendChild(stats);
        
        // Boutons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        
        // Bouton rejouer
        const replayButton = document.createElement('button');
        replayButton.textContent = 'Rejouer';
        replayButton.style.cssText = `
            padding: 12px 24px;
            margin: 0 10px;
            font-size: 18px;
            cursor: pointer;
            background: #04fbac;
            color: black;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.3s;
        `;
        replayButton.onmouseover = () => replayButton.style.transform = 'scale(1.1)';
        replayButton.onmouseout = () => replayButton.style.transform = 'scale(1)';
        replayButton.onclick = () => Game.reset();
        
        // Bouton quitter
        const quitButton = document.createElement('button');
        quitButton.textContent = 'Quitter';
        quitButton.style.cssText = `
            padding: 12px 24px;
            margin: 0 10px;
            font-size: 18px;
            cursor: pointer;
            background: #ff6600;
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.3s;
        `;
        quitButton.onmouseover = () => quitButton.style.transform = 'scale(1.1)';
        quitButton.onmouseout = () => quitButton.style.transform = 'scale(1)';
        quitButton.onclick = () => location.reload();
        
        buttonContainer.appendChild(replayButton);
        buttonContainer.appendChild(quitButton);
        gameOverMessage.appendChild(buttonContainer);
        
        // Son de fin
        SoundManager.play('gameOver');
        
        // Effet de victoire
        this.showVictoryEffect(winnerIndex);
    },
    
    hide: function() {
        document.getElementById('gameOverMessage').style.display = 'none';
        document.getElementById('gameOverMessage').innerHTML = '';
    },
    
    getGameDuration: function() {
        // Calculer la durée de la partie (à implémenter avec un timer)
        return '2:34'; // Placeholder
    },
    
    showVictoryEffect: function(winnerIndex) {
        const color = winnerIndex === 0 ? CONSTANTS.TEAM1_COLOR : CONSTANTS.TEAM2_COLOR;
        
        // Créer des particules de victoire
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${color};
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: 999;
                `;
                
                document.body.appendChild(particle);
                
                const angle = (Math.PI * 2 / 50) * i;
                const velocity = 5 + Math.random() * 5;
                const lifetime = 1000 + Math.random() * 1000;
                
                let time = 0;
                const animate = () => {
                    time += 16;
                    if (time > lifetime) {
                        particle.remove();
                        return;
                    }
                    
                    const progress = time / lifetime;
                    const distance = velocity * time / 10;
                    
                    particle.style.left = `${50 + Math.cos(angle) * distance}%`;
                    particle.style.top = `${50 + Math.sin(angle) * distance}%`;
                    particle.style.opacity = 1 - progress;
                    particle.style.transform = `translate(-50%, -50%) scale(${1 - progress * 0.5})`;
                    
                    requestAnimationFrame(animate);
                };
                
                requestAnimationFrame(animate);
            }, i * 20);
        }
    }
};