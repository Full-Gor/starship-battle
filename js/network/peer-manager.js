// peer-manager.js - Gestionnaire PeerJS

const PeerManager = {
    init: function() {
        console.log('Initialisation de PeerJS...');
        GameState.myPseudo = this.generatePseudo();
        console.log('Pseudo généré:', GameState.myPseudo);
        
        document.getElementById('peerIdSpan').textContent = GameState.myPseudo;
        document.getElementById('connectionStatus').textContent = 'Initialisation...';
        
        try {
            GameState.peer = new Peer(GameState.myPseudo);
            this.setupPeerEvents();
        } catch (err) {
            console.error('Erreur lors de la création de Peer:', err);
            document.getElementById('connectionStatus').textContent = 'Erreur PeerJS: ' + err.message;
        }
    },
    
    setupPeerEvents: function() {
        GameState.peer.on('open', (id) => {
            console.log('PeerJS ouvert, ID:', id);
            document.getElementById('peerIdSpan').textContent = GameState.myPseudo;
            document.getElementById('team1Name').textContent = GameState.myPseudo;
            document.getElementById('hostGame').disabled = false;
            document.getElementById('copyIdBtn').style.display = 'block';
            document.getElementById('connectionStatus').textContent = 'Connecté ! Partagez votre pseudo.';
        });
        
        GameState.peer.on('connection', (conn) => {
            console.log('Connexion entrante de:', conn.peer);
            Connection.setup(conn);
            GameState.isHost = true;
            GameState.myPlayerIndex = 0;
        });
        
        GameState.peer.on('error', (err) => {
            console.error('Erreur PeerJS:', err);
            document.getElementById('connectionStatus').textContent = 'Erreur: ' + err.message;
        });
    },
    
    generatePseudo: function() {
        const adjectives = ['Rapide', 'Brillant', 'Furtif', 'Cosmique', 'Étoile', 'Galactique'];
        const nouns = ['Vaisseau', 'Pilote', 'Guerrier', 'Explorateur', 'Comète', 'Nébuleuse'];
        const number = Math.floor(Math.random() * 100);
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
    },
    
    connect: function(peerId) {
        console.log('Connexion à:', peerId);
        try {
            const conn = GameState.peer.connect(peerId);
            Connection.setup(conn);
            GameState.isHost = false;
            GameState.myPlayerIndex = 1;
            document.getElementById('connectionStatus').textContent = 'Connexion en cours...';
            return conn;
        } catch (err) {
            console.error('Erreur connexion:', err);
            document.getElementById('connectionStatus').textContent = 'Erreur de connexion';
            return null;
        }
    }
};