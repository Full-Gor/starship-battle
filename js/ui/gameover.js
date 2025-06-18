function handleNetworkMessage(data) {
      if (!data || !data.type) return;

      switch(data.type) {
          case 'init':
              opponentPseudo = data.pseudo || 'Adversaire';
              console.log('Pseudo adversaire reçu :', opponentPseudo);
              updateScoreBoard();
              break;
          case 'playerInput':
              handleRemotePlayerInput(data);
              break;
          case 'bulletFired':
              addBulletFromNetwork(data);
              break;
          case 'powerUpGenerated':
              if (data.powerUp) gameState.powerUps.push(data.powerUp);
              break;
          case 'powerUpCollected':
              handlePowerUpCollection(data);
              break;
          case 'redPointGenerated':
              if (data.redPoint) gameState.redPoints.push(data.redPoint);
              break;
          case 'redPointCollected':
              handleRedPointCollection(data);
              break;
          case 'shieldActivated':
              if (data.playerIndex >= 0 && data.playerIndex < 2) {
                  activateShield(gameState.players[data.playerIndex]);
              }
              break;
          case 'assistantCreated':
              if (data.playerIndex >= 0 && data.playerIndex < 2 && data.assistant) {
                  createAssistantShip(gameState.players[data.playerIndex], data.assistant);
              }
              break;
          case 'ping':
              sendMessage({type: 'pong', timestamp: data.timestamp});
              break;
          case 'pong':
              if (data.timestamp) {
                  networkLatency = Date.now() - data.timestamp;
                  document.getElementById('statusText').textContent = `Connecté (${networkLatency}ms)`;
              }
              break;
          case 'resetGame':
              resetGame();
              break;
          case 'gameState':
              if (data.gameState && !isHost) {
                  syncGameState(data.gameState);
              }
              break;
      }
  }

  function sendMessage(data) {
      if (connection && connection.open) {
          try {
              connection.send(data);
          } catch (err) {
              console.error('Erreur envoi message :', err);
          }
      }
  }

  function syncGameState(remoteState) {
      if (remoteState.powerUps) {
          gameState.powerUps = remoteState.powerUps;
      }
      if (remoteState.redPoints) {
          gameState.redPoints = remoteState.redPoints;
      }
      if (remoteState.laserTraits) {
          gameState.laserTraits = remoteState.laserTraits;
      }
  }