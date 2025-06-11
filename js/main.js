// main.js - Point d'entrée principal

window.addEventListener('load', () => {
    console.log('🚀 Starship Battle - Chargement...');
    
    // Initialisation du jeu
    Game.init();
    
    // Initialisation du menu
    Menu.init();
    
    // Vérification de PeerJS
    if (typeof Peer !== 'undefined') {
        console.log('✅ PeerJS détecté');
        PeerManager.init();
    } else {
        console.log('⏳ En attente de PeerJS...');
        setTimeout(() => {
            if (typeof Peer !== 'undefined') {
                console.log('✅ PeerJS chargé');
                PeerManager.init();
            } else {
                console.error('❌ Erreur : PeerJS non disponible');
                document.getElementById('connectionStatus').textContent = 'Erreur : PeerJS non chargé';
            }
        }, 1000);
    }
    
    // Gestionnaire du bouton reset
    document.getElementById('resetButton').onclick = () => {
        Game.reset();
    };
    
    console.log('✅ Jeu prêt !');
});