console.log('🚀 Initialisation du jeu Starship Battle...');

  if (typeof Peer !== 'undefined') {
      console.log('✅ PeerJS disponible');
  } else {
      console.error('❌ PeerJS non chargé');
      document.getElementById('connectionStatus').textContent = 'Erreur : PeerJS non chargé';
  }

  function initializeGameApp() {
      loadImages();
      initPeerJS();
      console.log('✅ Starship Battle Versus chargé avec succès !');
  }

  document.addEventListener('DOMContentLoaded', initializeGameApp);