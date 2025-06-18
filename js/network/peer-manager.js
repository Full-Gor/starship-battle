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
    const adjectives = ['Astral', 'Cosmic', 'Solar', 'Lunar', 'Stellar', 'Space', 'Star', 'Galaxy'];
    const nouns = ['Pilot', 'Captain', 'Navigator', 'Explorer', 'Voyager', 'Warrior', 'Commander'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomAdjective}${randomNoun}${randomNumber}`;
}

function initPeerJS() {
    try {
        window.myPseudo = generatePeerId();
        console.log('Pseudo généré :', window.myPseudo);

        const peerConfig = {
            host: 'peerjs.herokuapp.com',
            secure: true,
            port: 443,
            config: {
                'iceServers': [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            },
            debug: 2,
            retries: 3
        };

        window.peer = new Peer(window.myPseudo, peerConfig);

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
            
            if (err.type === 'network' || err.type === 'server-error' || err.type === 'socket-error') {
                setTimeout(() => {
                    console.log('Tentative de reconnexion...');
                    updateConnectionStatus('Tentative de reconnexion...');
                    window.peer.destroy();
                    initPeerJS();
                }, 5000);
            }
        });

        window.peer.on('disconnected', function() {
            console.log('Déconnecté du serveur PeerJS');
            updateConnectionStatus('Déconnecté');
            
            setTimeout(() => {
                if (!window.peer.destroyed) {
                    window.peer.reconnect();
                }
            }, 5000);
        });

        window.peer.on('close', function() {
            console.log('Connexion PeerJS fermée');
            updateConnectionStatus('Connexion fermée');
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