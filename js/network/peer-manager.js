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

function initPeerJS() {
    try {
        // Générer un pseudo aléatoire
        const adjectives = ['Solaire', 'Cosmique', 'Galactique', 'Stellaire', 'Nébuleux', 'Astral', 'Céleste', 'Lunaire', 'Spatial', 'Orbital'];
        const nouns = ['Vaisseau', 'Pilote', 'Guerrier', 'Explorateur', 'Chasseur', 'Navigateur', 'Voyageur', 'Aventurier', 'Découvreur', 'Marin'];
        const randomNum = Math.floor(Math.random() * 1000);
        window.myPseudo = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNum}`;
        console.log('Pseudo généré :', window.myPseudo);

        // Initialiser PeerJS avec les options
        window.peer = new Peer(window.myPseudo, peerOptions);

        window.peer.on('open', (id) => {
            console.log('PeerJS ouvert, ID:', id);
            document.getElementById('peerIdSpan').textContent = id;
            document.getElementById('copyIdBtn').style.display = 'inline-block';
            document.getElementById('hostGame').disabled = false;
        });

        window.peer.on('connection', (conn) => {
            console.log('Connexion entrante de :', conn.peer);
            setupConnection(conn);
        });

        window.peer.on('error', (err) => {
            console.error('Erreur PeerJS :', err);
            document.getElementById('connectionStatus').textContent = 'Erreur de connexion : ' + err.message;
            
            // Tentative de reconnexion après 5 secondes
            setTimeout(() => {
                console.log('Tentative de reconnexion...');
                if (window.peer && window.peer.destroyed) {
                    initPeerJS();
                }
            }, 5000);
        });

        window.peer.on('disconnected', () => {
            console.log('Déconnecté du serveur PeerJS');
            document.getElementById('connectionStatus').textContent = 'Déconnecté. Tentative de reconnexion...';
            
            // Tentative de reconnexion après 3 secondes
            setTimeout(() => {
                console.log('Tentative de reconnexion...');
                if (window.peer && window.peer.destroyed) {
                    initPeerJS();
                }
            }, 3000);
        });

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de PeerJS:', error);
        document.getElementById('connectionStatus').textContent = 'Erreur d\'initialisation : ' + error.message;
        
        // Tentative de réinitialisation après 5 secondes
        setTimeout(() => {
            console.log('Tentative de réinitialisation...');
            initPeerJS();
        }, 5000);
    }
}

// Exporter la fonction initPeerJS globalement
window.initPeerJS = initPeerJS;