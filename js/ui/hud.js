function initializeLives() {
    const team1LivesContainer = document.getElementById('team1Lives');
    const team2LivesContainer = document.getElementById('team2Lives');

    if (team1LivesContainer) team1LivesContainer.innerHTML = '';
    if (team2LivesContainer) team2LivesContainer.innerHTML = '';

    for (let i = 0; i < Math.max(0, gameState.players[0].lives - gameState.players[0].impacts); i++) {
        const lifeIcon = document.createElement('div');
        lifeIcon.classList.add('life-icon');
        lifeIcon.style.background = '#04fbac';
        if (team1LivesContainer) team1LivesContainer.appendChild(lifeIcon);
    }

    for (let i = 0; i < Math.max(0, gameState.players[1].lives - gameState.players[1].impacts); i++) {
        const lifeIcon = document.createElement('div');
        lifeIcon.classList.add('life-icon');
        lifeIcon.style.background = '#FF7F50';
        if (team2LivesContainer) team2LivesContainer.appendChild(lifeIcon);
    }
}

function updateScoreBoard() {
    const team1Name = document.getElementById('team1Name');
    const team2Name = document.getElementById('team2Name');
    const team1Score = document.getElementById('team1Score');
    const team2Score = document.getElementById('team2Score');

    if (team1Name) team1Name.textContent = myPlayerIndex === 0 ? myPseudo : opponentPseudo;
    if (team2Name) team2Name.textContent = myPlayerIndex === 0 ? opponentPseudo : myPseudo;
    if (team1Score) team1Score.textContent = gameState.players[0].gamesWon || 0;
    if (team2Score) team2Score.textContent = gameState.players[1].gamesWon || 0;
}