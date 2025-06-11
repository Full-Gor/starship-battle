// menu.js - Menu de connexion

const Menu = {
    init: function() {
        // Bouton héberger
        document.getElementById('hostGame').addEventListener('click', () => {
            this.hostGame();
        });
        
        // Bouton rejoindre
        document.getElementById('joinGame').addEventListener('click', () => {
            this.joinGame();
        });
        
        // Bouton copier ID
        document.getElementById('copyIdBtn').addEventListener('click', () => {
            this.copyPseudo();
        });
        
        // Entrée pour rejoindre (Enter)
        document.getElementById('joinGameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.joinGame();
            }
        });
    },
    
    hostGame: function() {
        document.getElementById('connectionStatus').textContent = 'En attente de votre adversaire... Partagez votre pseudo !';
        GameState.isHost = true;
        GameState.myPlayerIndex = 0;
        
        // Animation d'attente
        let dots = 0;
        const waitingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            const dotsText = '.'.repeat(dots);
            document.getElementById('connectionStatus').textContent = 
                `En attente de votre adversaire${dotsText} Partagez votre pseudo !`;
            
            if (GameState.gameStarted) {
                clearInterval(waitingInterval);
            }
        }, 500);
    },
    
    joinGame: function() {
        const peerID = document.getElementById('joinGameInput').value.trim();
        
        if (!peerID) {
            document.getElementById('connectionStatus').textContent = 'Entrez un pseudo valide';
            document.getElementById('connectionStatus').style.color = '#ff0000';
            setTimeout(() => {
                document.getElementById('connectionStatus').style.color = 'white';
            }, 2000);
            return;
        }
        
        const conn = PeerManager.connect(peerID);
        if (conn) {
            document.getElementById('joinGame').disabled = true;
            document.getElementById('joinGameInput').disabled = true;
        }
    },
    
    copyPseudo: function() {
        const peerIdText = document.getElementById('peerIdSpan').textContent;
        
        navigator.clipboard.writeText(peerIdText).then(() => {
            const btn = document.getElementById('copyIdBtn');
            const originalText = btn.textContent;
            const originalBg = btn.style.backgroundColor;
            
            btn.textContent = '✅ Copié !';
            btn.style.backgroundColor = '#00ff00';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = originalBg;
            }, 2000);
        }).catch(() => {
            // Fallback pour les navigateurs qui ne supportent pas clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = peerIdText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                const btn = document.getElementById('copyIdBtn');
                btn.textContent = '✅ Copié !';
                setTimeout(() => {
                    btn.textContent = '📋 Copier';
                }, 2000);
            } catch (err) {
                alert('Pseudo à copier : ' + peerIdText);
            }
            
            document.body.removeChild(textArea);
        });
    },
    
    hide: function() {
        document.getElementById('connectionPanel').style.display = 'none';
    },
    
    show: function() {
        document.getElementById('connectionPanel').style.display = 'block';
    }
};