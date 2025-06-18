// Initialisation de PeerJS
console.log('Initialisation de PeerJS...');

// Configuration de PeerJS avec des options plus robustes
const peerOptions = {
    host: 'peerjs-server.herokuapp.com',
    secure: true,
    port: 443,
    config: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
        ]
    },
    debug: 3
};

// Variables globales
window.peer = null;
window.myPseudo = null;
window.isHost = false;
window.myPlayerIndex = 0;

function generatePeerId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function initPeerJS() {
    try {
        window.myPseudo = generatePeerId();
        console.log('ID généré:', window.myPseudo);

        window.peer = new Peer(window.myPseudo);

        window.peer.on('open', function(id) {
            console.log('Connecté au serveur PeerJS avec l\'ID:', id);
            document.getElementById('peerIdSpan').textContent = id;
            document.getElementById('copyIdBtn').style.display = 'inline-block';
            document.getElementById('hostGame').disabled = false;
            updateConnectionStatus('Connecté au serveur');
        });

        window.peer.on('error', function(err) {
            console.error('Erreur PeerJS :', err);
            updateConnectionStatus('Erreur de connexion');
        });

        window.peer.on('disconnected', function() {
            console.log('Déconnecté du serveur PeerJS');
            updateConnectionStatus('Déconnecté');
        });

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de PeerJS:', error);
        updateConnectionStatus('Erreur d\'initialisation');
    }
}

function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

// Exporter la fonction initPeerJS globalement
window.initPeerJS = initPeerJS;