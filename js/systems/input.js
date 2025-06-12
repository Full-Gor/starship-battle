const keys = {};
const mouse = { x: 0, y: 0, clicking: false };

window.addEventListener('keydown', (e) => {
    if (e.target && e.target.tagName === 'INPUT') return;
    keys[e.code] = true;
    if (gameStarted) e.preventDefault();
});

window.addEventListener('keyup', (e) => {
    if (e.target && e.target.tagName === 'INPUT') return;
    keys[e.code] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        mouse.clicking = true;
        e.preventDefault();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        mouse.clicking = false;
    }
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

function handleLocalPlayerInput() {
    if (!gameStarted || gameState.paused || gameState.gameOver) return;

    const player = gameState.players[myPlayerIndex];
    if (!player || !player.active) return;

    let moved = false;
    let shot = false;
    const currentTime = Date.now();
    const shootCooldown = 150;

    const midPoint = canvas.height / 2;
    const isMouseInPlayerZone = myPlayerIndex === 0 ? mouse.y <= midPoint - 10 : mouse.y >= midPoint + 10;

    if (isMouseInPlayerZone && mouse.x > 0 && mouse.y > 0) {
        const targetX = Math.max(player.width/2, Math.min(canvas.width - player.width/2, mouse.x));
        const minY = myPlayerIndex === 0 ? player.height/2 : midPoint + 10 + player.height/2;
        const maxY = myPlayerIndex === 0 ? midPoint - 10 - player.height/2 : canvas.height - player.height/2;
        const targetY = Math.max(minY, Math.min(maxY, mouse.y));

        if (Math.abs(player.x - targetX) > 1 || Math.abs(player.y - targetY) > 1) {
            player.x = targetX;
            player.y = targetY;
            moved = true;
        }

        if (mouse.clicking && currentTime - player.lastShootTime > shootCooldown) {
            shot = true;
        }
    }

    const controls = myPlayerIndex === 0 ?
        { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', shoot: 'KeyG' } :
        { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', shoot: 'Space' };

    const speed = 4;
    let keyboardMoved = false;

    if (keys[controls.left] && player.x > player.width/2) {
        player.x -= speed;
        keyboardMoved = true;
    }
    if (keys[controls.right] && player.x < canvas.width - player.width/2) {
        player.x += speed;
        keyboardMoved = true;
    }
    if (keys[controls.up]) {
        const minY = myPlayerIndex === 0 ? player.height/2 : midPoint + 10 + player.height/2;
        if (player.y > minY) {
            player.y -= speed;
            keyboardMoved = true;
        }
    }
    if (keys[controls.down]) {
        const maxY = myPlayerIndex === 0 ? midPoint - 10 - player.height/2 : canvas.height - player.height/2;
        if (player.y < maxY) {
            player.y += speed;
            keyboardMoved = true;
        }
    }
    if (keys[controls.shoot] && currentTime - player.lastShootTime > shootCooldown) {
        shot = true;
    }

    if (keyboardMoved) moved = true;

    if (shot) {
        shootBullet(player, myPlayerIndex);
        player.lastShootTime = currentTime;
    }

    if (moved || shot) {
        sendMessage({
            type: 'playerInput',
            playerIndex: myPlayerIndex,
            x: player.x,
            y: player.y,
            shot: shot
        });
    }
}

function handleRemotePlayerInput(data) {
    if (!data || data.playerIndex === myPlayerIndex) return;
    
    const player = gameState.players[data.playerIndex];
    if (!player) return;
    
    player.x = data.x;
    player.y = data.y;

    if (data.shot) {
        shootBullet(player, data.playerIndex);
    }
}