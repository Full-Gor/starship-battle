const soundEffects = {
      shoot: new Audio('../assets/audio/shoot.mp3'),
      hit: new Audio('../assets/audio/hit.mp3'),
      perfect: new Audio('../assets/audio/perfect.mp3'),
      awesome: new Audio('../assets/audio/awesome.mp3'),
      gameOver: new Audio('../assets/audio/gameOver.mp3')
  };

  function playSound(sound) {
      if (sound && sound.paused) {
          sound.currentTime = 0;
          sound.play().catch(err => console.warn('Erreur lecture son:', err));
      }
  }