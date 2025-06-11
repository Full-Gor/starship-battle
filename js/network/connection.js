// connection.js - Gestion des connexions

const Connection = {
    setup: function(conn) {
        GameState.connection = conn;
        
        conn.on('open', () => {
            console.log('Connexion établie !');
            document.getElementById('connectionStatus').textContent = 'Connecté !';
            
            // Envoyer le pseudo local
            NetworkSync.sendMessage({ type: 'init', pseudo: GameState.myPseudo });
            Game.start();
        });
        
        conn.on('data', (data) => {
            NetworkSync.handleMessage(data);
        });
        
        conn.on('close', () => {
            console.log('Connexion fermée');
            document.getElementById('connectionStatus').textContent = 'Connexion perdue';
            GameState.opponentPseudo = 'Adversaire';
            HUD.updateScoreBoard();
            this.handleDisconnection();
        });
        
        conn.on('error', (err) => {
            console.error('Erreur de connexion:', err);
            document.getElementById('connectionStatus').textContent = 'Erreur: ' + err.message;
        });
    },
    
    handleDisconnection: function() {
        // Pause le jeu
        GameState.paused = true;
        
        // Afficher un message
        const messageDiv = document.createElement('div');
        messageDiv.id = 'disconnectionMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #ff0000;
            z-index: 1000;
            text-align: center;
        `;
        messageDiv.innerHTML = `
            <h2 style="color: #ff0000;">Connexion perdue</h2>
            <p>Votre adversaire s'est déconnecté</p>
            <button onclick="location.reload()" style="
                padding: 10px 20px;
                margin-top: 10px;
                background: #04fbac;
                color: black;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Retour au menu</button>
        `;
        
        document.body.appendChild(messageDiv);
    },
    
    isConnected: function() {
        return GameState.connection && GameState.connection.open;
    }
};