function render() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawStarField();

      gameState.laserTraits.forEach(trait => {
          ctx.save();
          ctx.globalAlpha = trait.opacity;
          ctx.fillStyle = trait.color;
          ctx.shadowColor = trait.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(trait.x, trait.y, trait.width, trait.height);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(trait.x, trait.y, trait.width, trait.height);
          ctx.restore();
      });

      gameState.powerUps.forEach(powerUp => {
          ctx.save();
          ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
          ctx.rotate(powerUp.rotation || 0);

          ctx.shadowColor = ['#ff0000', '#ff00ff', '#ffff00'][powerUp.type - 1]; // Ajusté pour type 1 et 2
          ctx.shadowBlur = 15;

          if (powerUpImgs[powerUp.type - 1] && powerUpImgs[powerUp.type - 1].complete) {
              ctx.drawImage(
                  powerUpImgs[powerUp.type - 1],
                  -powerUp.width / 2,
                  -powerUp.height / 2,
                  powerUp.width,
                  powerUp.height
              );
          } else {
              ctx.fillStyle = ['#ff0000', '#ff00ff', '#ffff00'][powerUp.type - 1];
              ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
          }
          ctx.restore();
      });

      gameState.redPoints.forEach(point => {
          ctx.save();
          ctx.fillStyle = '#ff0000';
          ctx.shadowColor = '#ff0000';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size || 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
      });

      gameState.players.forEach(player => {
          player.bullets.forEach(bullet => {
              ctx.save();
              ctx.fillStyle = bullet.color;
              ctx.shadowColor = bullet.color;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
          });
      });

      drawShields();
      drawAssistants();
      drawPlayers();
  }

  function drawStarField() {
      const time = Date.now() * 0.0001;
      for (let i = 0; i < 50; i++) {
          const x = (i * 137.5) % canvas.width;
          const y = (i * 127.3 + time * 20) % canvas.height;
          const size = (i % 3) + 1;
          const alpha = 0.3 + (Math.sin(time + i) * 0.3);
          
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
      }
  }