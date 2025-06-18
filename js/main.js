window.addEventListener('load', () => {
    console.log('🚀 Initialisation du jeu Starship Battle...');
    
    // Charger les images avant de démarrer
    if (typeof ImageLoader !== 'undefined') {
        ImageLoader.loadAll();
    } else {
        console.error('❌ ImageLoader non disponible');
    }
    
    if (typeof Peer !== 'undefined') {
        console.log('✅ PeerJS disponible');
        if (typeof window.initPeerJS === 'function') {
            window.initPeerJS();
        } else {
            console.error('❌ initPeerJS non disponible');
        }
    } else {
        console.log('⏳ Attente de PeerJS...');
        setTimeout(() => {
            if (typeof Peer !== 'undefined') {
                console.log('✅ PeerJS chargé avec succès');
                if (typeof window.initPeerJS === 'function') {
                    window.initPeerJS();
                } else {
                    console.error('❌ initPeerJS non disponible');
                }
            } else {
                console.error('❌ Erreur : PeerJS non chargé');
                document.getElementById('connectionStatus').textContent = 'Erreur : PeerJS non disponible';
            }
        }, 2000);
    }
});

window.addEventListener('beforeunload', (e) => {
    if (gameStarted && connection && connection.open) {
        e.preventDefault();
        e.returnValue = 'Vous êtes en cours de partie. Voulez-vous vraiment quitter ?';
        return e.returnValue;
    }
});

console.log("✅ Starship Battle Versus chargé avec succès !");

function initializeGameApp() {
    if (typeof ImageLoader !== 'undefined') {
        ImageLoader.loadAll();
    } else {
        console.error('❌ ImageLoader non disponible');
    }
    if (typeof window.initPeerJS === 'function') {
        window.initPeerJS();
    } else {
        console.error('❌ initPeerJS non disponible');
    }
    console.log('✅ Starship Battle Versus chargé avec succès !');
}

document.addEventListener('DOMContentLoaded', initializeGameApp);