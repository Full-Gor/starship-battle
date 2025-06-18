function initPeerJS() {
    console.log('Initialisation de PeerJS...');
    
    if (typeof Peer === 'undefined') {
        console.error('PeerJS non disponible');
        document.getElementById('connectionStatus').textContent = 'Erreur : PeerJS non disponible';
        return;
    }

    try {
        myPseudo = generatePseudo();
        console.log('Pseudo généré :', myPseudo);
        document.getElementById('peerIdSpan').textContent = 'Initialisation...';
        document.getElementById('connectionStatus').textContent = 'Initialisation...';

        peer = new Peer(myPseudo);

        peer.on('open', function(id) {
            console.log('PeerJS ouvert, ID:', id);
            document.getElementById('peerIdSpan').textContent = myPseudo;
            document.getElementById('hostGame').disabled = false;
            document.getElementById('copyIdBtn').style.display = 'inline-block';
            document.getElementById('connectionStatus').textContent = 'Connecté ! Partagez votre pseudo pour commencer.';
        });

        peer.on('connection', function(conn) {
            console.log('Connexion entrante de :', conn.peer);
            setupConnection(conn);
            isHost = true;
            myPlayerIndex = 0;
        });

        peer.on('error', function(err) {
            console.error('Erreur PeerJS :', err);
            document.getElementById('connectionStatus').textContent = 'Erreur : ' + err.message;
            document.getElementById('peerIdSpan').textContent = 'Erreur de connexion';
            document.getElementById('hostGame').disabled = true;
            document.getElementById('copyIdBtn').style.display = 'none';
        });

    } catch (err) {
        console.error('Erreur lors de la création de Peer :', err);
        document.getElementById('connectionStatus').textContent = 'Erreur PeerJS : ' + err.message;
        document.getElementById('peerIdSpan').textContent = 'Erreur de connexion';
        document.getElementById('hostGame').disabled = true;
        document.getElementById('copyIdBtn').style.display = 'none';
    }
}