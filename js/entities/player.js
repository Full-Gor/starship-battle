function drawPlayers() {
    gameState.players.forEach((player, index) => {
        if (!player.active) return;

        ctx.save();

        if (player.impacts > 0 && player.impacts < 10) {
            const flashIntensity = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;
            ctx.globalAlpha = flashIntensity;
        }

        const img = index === 0 ? starshipImg : starship2Img;
        if (img && img.complete) {
            ctx.drawImage(
                img,
                player.x - player.width / 2,
                player.y - player.height / 2,
                player.width,
                player.height
            );
        } else {
            ctx.fillStyle = index === 0 ? '#04fbac' : '#FF7F50';
            ctx.fillRect(
                player.x - player.width / 2,
                player.y - player.height / 2,
                player.width,
                player.height
            );
        }

        ctx.restore();

        if (player.impacts > 0) {
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `${player.impacts}/10`,
                player.x,
                player.y - player.height / 2 - 15
            );
        }

        if (player.powerUpLevel > 0) {
            ctx.fillStyle = '#ff00ff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `LV${player.powerUpLevel}`,
                player.x,
                player.y + player.height / 2 + 20
            );
        }
    });
}