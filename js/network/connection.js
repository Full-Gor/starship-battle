// Variables globales
window.connection = null;
window.gameStarted = false;

function setupConnection(conn) {
    window.connection = conn;

    conn.on('open', () => {
        console.log('Connexion établie !');
        document.getElementById('connectionStatus').textContent = 'Connexion réussie ! Chargement des images...';
        
        // Vérifier si les images sont chargées
        if (ImageLoader.isReady()) {
            startGameAfterConnection();
        } else {
            // Attendre que les images soient chargées
            const checkImagesInterval = setInterval(() => {
                if (ImageLoader.isReady()) {
                    clearInterval(checkImagesInterval);
                    startGameAfterConnection();
                }
            }, 100);
        }
    });

    conn.on('data', function(data) {
        try {
            handleNetworkMessage(data);
        } catch (error) {
            console.error('Erreur lors du traitement du message:', error);
        }
    });

    conn.on('close', function() {
        console.log('Connexion fermée');
        document.getElementById('connectionStatus').textContent = 'Connexion perdue';
        window.gameStarted = false;
        
        // Tentative de reconnexion si on est l'hôte
        if (window.isHost) {
            setTimeout(() => {
                console.log('Tentative de reconnexion...');
                if (window.peer && !window.peer.destroyed) {
                    const newConn = window.peer.connect(conn.peer);
                    if (newConn) {
                        setupConnection(newConn);
                    }
                }
            }, 3000);
        }
    });

    conn.on('error', function(err) {
        console.error('Erreur de connexion:', err);
        document.getElementById('connectionStatus').textContent = 'Erreur de connexion: ' + err.message;
    });
}

function startGameAfterConnection() {
    document.getElementById('connectionStatus').textContent = 'Connexion réussie ! Démarrage du jeu...';
    sendMessage({ type: 'init', pseudo: window.myPseudo });
    
    // Augmenter le délai pour s'assurer que tout est prêt
    setTimeout(() => {
        if (typeof window.startGame === 'function') {
            window.startGame();
        } else {
            console.error('❌ Erreur : fonction startGame non disponible');
            document.getElementById('connectionStatus').textContent = 'Erreur : impossible de démarrer le jeu';
        }
    }, 2000);
}

function sendMessage(message) {
    if (window.connection && window.connection.open) {
        try {
            window.connection.send(message);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    } else {
        console.warn('Tentative d\'envoi de message sans connexion active');
    }
}

document.getElementById('hostGame').addEventListener('click', () => {
    document.getElementById('connectionStatus').textContent = 'En attente de connexion... Partagez votre pseudo !';
    window.isHost = true;
    window.myPlayerIndex = 0;
});

document.getElementById('copyIdBtn').addEventListener('click', () => {
    const peerIdText = document.getElementById('peerIdSpan').textContent;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(peerIdText).then(() => {
            const btn = document.getElementById('copyIdBtn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copié !';
            btn.style.backgroundColor = '#00ff00';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '#04fbac';
            }, 2000);
        }).catch(() => {
            alert('Pseudo copié : ' + peerIdText);
        });
    } else {
        alert('Pseudo : ' + peerIdText);
    }
});

document.getElementById('joinGame').addEventListener('click', () => {
    const peerID = document.getElementById('joinGameInput').value.trim();
    if (peerID && peerID !== window.myPseudo) {
        console.log('Tentative de connexion à :', peerID);
        try {
            const conn = window.peer.connect(peerID, {
                reliable: true,
                serialization: 'json'
            });
            setupConnection(conn);
            window.isHost = false;
            window.myPlayerIndex = 1;
            document.getElementById('connectionStatus').textContent = 'Connexion en cours...';
        } catch (err) {
            console.error('Erreur connexion :', err);
            document.getElementById('connectionStatus').textContent = 'Erreur de connexion : ' + err.message;
        }
    } else {
        document.getElementById('connectionStatus').textContent = 'Entrez un pseudo valide et différent du vôtre';
    }
});