function render() {
    if (!window.gameCanvas.canvas || !window.gameCanvas.ctx) return;

    window.gameCanvas.ctx.clearRect(0, 0, window.gameCanvas.canvas.width, window.gameCanvas.canvas.height);

    drawStarField();

    gameState.laserTraits.forEach(trait => {
        window.gameCanvas.ctx.save();
        window.gameCanvas.ctx.globalAlpha = trait.opacity;
        window.gameCanvas.ctx.fillStyle = trait.color;
        window.gameCanvas.ctx.shadowColor = trait.color;
        window.gameCanvas.ctx.shadowBlur = 10;
        window.gameCanvas.ctx.fillRect(trait.x, trait.y, trait.width, trait.height);
        window.gameCanvas.ctx.strokeStyle = '#ffffff';
        window.gameCanvas.ctx.lineWidth = 2;
        window.gameCanvas.ctx.strokeRect(trait.x, trait.y, trait.width, trait.height);
        window.gameCanvas.ctx.restore();
    });

    gameState.powerUps.forEach(powerUp => {
        window.gameCanvas.ctx.save();
        window.gameCanvas.ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
        window.gameCanvas.ctx.rotate(powerUp.rotation || 0);

        const powerUpImg = ImageLoader.get(`powerUp${powerUp.type}`);
        window.gameCanvas.ctx.shadowColor = ['#ff0000', '#ff00ff', '#ffff00'][powerUp.type];
        window.gameCanvas.ctx.shadowBlur = 15;

        if (powerUpImg && powerUpImg.complete) {
            window.gameCanvas.ctx.drawImage(
                powerUpImg,
                -powerUp.width / 2,
                -powerUp.height / 2,
                powerUp.width,
                powerUp.height
            );
        } else {
            window.gameCanvas.ctx.fillStyle = ['#ff0000', '#ff00ff', '#ffff00'][powerUp.type];
            window.gameCanvas.ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
        }
        window.gameCanvas.ctx.restore();
    });

    gameState.redPoints.forEach(point => {
        window.gameCanvas.ctx.save();
        window.gameCanvas.ctx.fillStyle = '#ff0000';
        window.gameCanvas.ctx.shadowColor = '#ff0000';
        window.gameCanvas.ctx.shadowBlur = 8;
        window.gameCanvas.ctx.beginPath();
        window.gameCanvas.ctx.arc(point.x, point.y, point.size || 3, 0, Math.PI * 2);
        window.gameCanvas.ctx.fill();
        window.gameCanvas.ctx.restore();
    });

    gameState.players.forEach((player, index) => {
        // Dessiner les balles
        player.bullets.forEach(bullet => {
            window.gameCanvas.ctx.save();
            window.gameCanvas.ctx.fillStyle = bullet.color;
            window.gameCanvas.ctx.shadowColor = bullet.color;
            window.gameCanvas.ctx.shadowBlur = 8;
            window.gameCanvas.ctx.beginPath();
            window.gameCanvas.ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
            window.gameCanvas.ctx.fill();
            window.gameCanvas.ctx.restore();
        });

        // Dessiner le joueur
        if (player.active) {
            window.gameCanvas.ctx.save();
            const playerImg = ImageLoader.get(index === 0 ? 'starship1' : 'starship2');
            if (playerImg && playerImg.complete) {
                window.gameCanvas.ctx.drawImage(playerImg, player.x - player.width/2, player.y - player.height/2, player.width, player.height);
            } else {
                window.gameCanvas.ctx.fillStyle = index === 0 ? '#04fbac' : '#FF7F50';
                window.gameCanvas.ctx.fillRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height);
            }
            window.gameCanvas.ctx.restore();
        }

        // Dessiner les assistants
        player.assistantShips.forEach((assistant, i) => {
            window.gameCanvas.ctx.save();
            const assistantImg = ImageLoader.get(`assistant${(i % 6) + 1}`);
            if (assistantImg && assistantImg.complete) {
                window.gameCanvas.ctx.drawImage(
                    assistantImg,
                    assistant.x,
                    assistant.y,
                    assistant.width,
                    assistant.height
                );
            } else {
                window.gameCanvas.ctx.fillStyle = index === 0 ? '#04fbac' : '#FF7F50';
                window.gameCanvas.ctx.fillRect(assistant.x, assistant.y, assistant.width, assistant.height);
            }
            window.gameCanvas.ctx.restore();
        });

        // Dessiner le bouclier si actif
        if (player.shield) {
            window.gameCanvas.ctx.save();
            window.gameCanvas.ctx.strokeStyle = index === 0 ? '#04fbac' : '#FF7F50';
            window.gameCanvas.ctx.lineWidth = 2;
            window.gameCanvas.ctx.beginPath();
            window.gameCanvas.ctx.arc(player.x, player.y, player.width * 0.8, 0, Math.PI * 2);
            window.gameCanvas.ctx.stroke();
            window.gameCanvas.ctx.restore();
        }
    });
}

function drawStarField() {
    const time = Date.now() * 0.0001;
    for (let i = 0; i < 50; i++) {
        const x = (i * 137.5) % window.gameCanvas.canvas.width;
        const y = (i * 127.3 + time * 20) % window.gameCanvas.canvas.height;
        const size = (i % 3) + 1;
        const alpha = 0.3 + (Math.sin(time + i) * 0.3);
        
        window.gameCanvas.ctx.save();
        window.gameCanvas.ctx.globalAlpha = alpha;
        window.gameCanvas.ctx.fillStyle = '#ffffff';
        window.gameCanvas.ctx.beginPath();
        window.gameCanvas.ctx.arc(x, y, size, 0, Math.PI * 2);
        window.gameCanvas.ctx.fill();
        window.gameCanvas.ctx.restore();
    }
}