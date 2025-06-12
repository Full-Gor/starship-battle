function endGame(winnerIndex) {
    if (gameState.gameOver) return;

    gameState.gameOver = true;
    gameState.winner = winnerIndex;
    gameState.players[winnerIndex].gamesWon++;

    const winnerName = winnerIndex === myPlayerIndex ? myPseudo : opponentPseudo;
    const gameOverMessage = document.getElementById('gameOverMessage');
    
    gameOverMessage.innerHTML = `
        <h2>🏆 Victoire de ${winnerName} !</h2>
        <p>Parties gagnées : ${gameState.players[winnerIndex].gamesWon}</p>
        <button onclick="resetGame()" style="
            padding: 15px 30px;
            font-size: 18px;
            background: #04fbac;
            color: black;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            font-weight: bold;
        ">🔄 Rejouer</button>
    `;
    
    gameOverMessage.style.display = 'block';
    gameOverMessage.style.color = winnerIndex === 0 ? '#04fbac' : '#FF7F50';
    gameOverMessage.style.borderColor = winnerIndex === 0 ? '#04fbac' : '#FF7F50';

    playSound(soundEffects.gameOver);
    updateScoreBoard();
}

function resetGame() {
    console.log('Réinitialisation du jeu...');
    
    gameState.gameOver = false;
    gameState.winner = null;
    gameState.paused = false;
    gameInitialized = false;

    gameState.players.forEach((player, index) => {
        player.lives = 10;
        player.impacts = 0;
        player.active = true;
        player.bullets = [];
        player.powerUpLevel = 0;
        player.shield = false;
        player.redPointsCollected = 0;
        player.thunderActive = false;
        player.thunderCount = 0;
        player.assistantShips = [];
        player.lastShootTime = 0;
        
        if (player.shieldTimeout) {
            clearTimeout(player.shieldTimeout);
            player.shieldTimeout = null;
        }
    });

    gameState.powerUps = [];
    gameState.redPoints = [];
    gameState.laserTraits = [];
    shieldParticles.particles = [];

    document.getElementById('gameOverMessage').style.display = 'none';
    const p1RedPoints = document.getElementById('p1RedPoints');
    const p2RedPoints = document.getElementById('p2RedPoints');
    if (p1RedPoints) p1RedPoints.textContent = '0';
    if (p2RedPoints) p2RedPoints.textContent = '0';

    if (connection && connection.open) {
        sendMessage({ type: 'resetGame' });
    }

    initializeGame();
    console.log('Jeu réinitialisé avec succès');
}