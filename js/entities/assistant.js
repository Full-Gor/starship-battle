function createAssistantShip(player, assistantData) {
      if (!player) return;

      const assistant = assistantData || {
          x: player.x,
          y: player.y,
          width: 30,
          height: 30,
          health: 3,
          shootCooldown: 0,
          type: Math.floor(Math.random() * assistantShipImgs.length),
          id: Date.now() + Math.random()
      };

      player.assistantShips.push(assistant);

      if (!assistantData && player === gameState.players[myPlayerIndex]) {
          sendMessage({
              type: 'assistantCreated',
              playerIndex: gameState.players.indexOf(player),
              assistant: assistant
          });
      }
  }

  function updateAssistants() {
      gameState.players.forEach(player => {
          player.assistantShips.forEach(assistant => {
              const targetX = player.x + (player.assistantShips.indexOf(assistant) - (player.assistantShips.length - 1) / 2) * 40;
              const targetY = player.y + (gameState.players.indexOf(player) === 0 ? 40 : -40);

              assistant.x += (targetX - assistant.x) * 0.1;
              assistant.y += (targetY - assistant.y) * 0.1;

              if (assistant.shootCooldown > 0) {
                  assistant.shootCooldown--;
              } else {
                  const currentTime = Date.now();
                  if (currentTime - player.lastShootTime < 150) {
                      shootBullet({
                          x: assistant.x + assistant.width / 2,
                          y: assistant.y + (gameState.players.indexOf(player) === 0 ? assistant.height : -assistant.height),
                          width: 10,
                          height: 10
                      }, gameState.players.indexOf(player));
                      assistant.shootCooldown = 30;
                  }
              }
          });
      });
  }

  function drawAssistants() {
      gameState.players.forEach((player, index) => {
          player.assistantShips.forEach(assistant => {
              ctx.save();
              ctx.translate(assistant.x + assistant.width / 2, assistant.y + assistant.height / 2);

              if (assistantShipImgs[assistant.type] && assistantShipImgs[assistant.type].complete) {
                  ctx.drawImage(
                      assistantShipImgs[assistant.type],
                      -assistant.width / 2,
                      -assistant.height / 2,
                      assistant.width,
                      assistant.height
                  );
              } else {
                  ctx.fillStyle = index === 0 ? '#04fbac' : '#FF7F50';
                  ctx.fillRect(-assistant.width / 2, -assistant.height / 2, assistant.width, assistant.height);
              }

              ctx.restore();
          });
      });
  }