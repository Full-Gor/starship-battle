const gameState = {
      players: [
          {
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              lives: 10,
              bullets: [],
              powerUpLevel: 0,
              active: true,
              shield: false,
              shieldTimeout: null,
              points: 0,
              impacts: 0,
              redPointsCollected: 0,
              assistantShips: [],
              gamesWon: 0,
              lastShootTime: 0
          },
          {
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              lives: 10,
              bullets: [],
              powerUpLevel: 0,
              active: true,
              shield: false,
              shieldTimeout: null,
              points: 0,
              impacts: 0,
              redPointsCollected: 0,
              assistantShips: [],
              gamesWon: 0,
              lastShootTime: 0
          }
      ],
      powerUps: [],
      redPoints: [],
      laserTraits: [],
      paused: false,
      gameOver: false,
      winner: null,
      lastPowerUpGeneration: 0,
      lastTraitGeneration: 0
  };

  const shieldParticles = {
      particles: [],
      colors: ['#04fbac', '#00ffff', '#ff4444', '#0080ff'],
      particleCount: 20
  };