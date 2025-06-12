function setupConnection(conn) {
    connection = conn;

    conn.on('open', () => {
        console.log('Connexion établie !');
        document.getElementById('connectionStatus').textContent = 'Connexion réussie ! Démarrage du jeu...';
        sendMessage({ type: 'init', pseudo: myPseudo });
        setTimeout(() => startGame(), 1000);
    });

    conn.on('data', function(data) {
        handleNetworkMessage(data);
    });

    conn.on('close', function() {
        console.log('Connexion fermée');
        document.getElementById('connectionStatus').textContent = 'Connexion perdue';
        gameStarted = false;
    });

    conn.on('error', function(err) {
        console.error('Erreur de connexion:', err);
        document.getElementById('connectionStatus').textContent = 'Erreur de connexion: ' + err.message;
    });
}

document.getElementById('hostGame').addEventListener('click', () => {
    document.getElementById('connectionStatus').textContent = 'En attente de connexion... Partagez votre pseudo !';
    isHost = true;
    myPlayerIndex = 0;
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
    if (peerID && peerID !== myPseudo) {
        console.log('Tentative de connexion à :', peerID);
        try {
            const conn = peer.connect(peerID);
            setupConnection(conn);
            isHost = false;
            myPlayerIndex = 1;
            document.getElementById('connectionStatus').textContent = 'Connexion en cours...';
        } catch (err) {
            console.error('Erreur connexion :', err);
            document.getElementById('connectionStatus').textContent = 'Erreur de connexion : ' + err.message;
        }
    } else {
        document.getElementById('connectionStatus').textContent = 'Entrez un pseudo valide et différent du vôtre';
    }
});