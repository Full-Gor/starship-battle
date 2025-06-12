function activateShield(player, duration = 4000) {
    if (!player || !player.active) return;

    player.shield = true;
    createShieldParticles(player);

    if (player.shieldTimeout) clearTimeout(player.shieldTimeout);

    player.shieldTimeout = setTimeout(() => {
        player.shield = false;
        const playerIndex = gameState.players.indexOf(player);
        shieldParticles.particles = shieldParticles.particles.filter(p => p.playerIndex !== playerIndex);
    }, duration);

    console.log('Shield activated for:', duration, 'ms');
}

function createShieldParticles(player) {
    const playerIndex = gameState.players.indexOf(player);
    if (playerIndex === -1) return;

    shieldParticles.particles = shieldParticles.particles.filter(p => p.playerIndex !== playerIndex);

    for (let i = 0; i < shieldParticles.particleCount; i++) {
        const angle = (Math.PI * 2 * i) / shieldParticles.particleCount;
        const distance = 35 + Math.random() * 10;
        
        shieldParticles.particles.push({
            angle: angle,
            distance: distance,
            size: 2 + Math.random() * 3,
            speed: 0.02 + Math.random() * 0.03,
            color: shieldParticles.colors[i % shieldParticles.colors.length],
            playerIndex: playerIndex,
            opacity: 0.6 + Math.random() * 0.4,
            baseDistance: distance
        });
    }
}

function updateShieldParticles() {
    shieldParticles.particles.forEach(particle => {
        particle.angle += particle.speed;
        particle.distance = particle.baseDistance + Math.sin(Date.now() * 0.003 + particle.angle) * 5;
        if (particle.angle > Math.PI * 2) particle.angle -= Math.PI * 2;
    });
}

function drawShields() {
    gameState.players.forEach((player, index) => {
        if (!player.shield) return;

        const centerX = player.x;
        const centerY = player.y;

        ctx.save();
        const gradient = ctx.createRadialGradient(
            centerX, centerY, player.width / 2,
            centerX, centerY, player.width / 2 + 25
        );

        const playerColor = index === 0 ? '4, 251, 172' : '255, 127, 80';
        gradient.addColorStop(0, `rgba(${playerColor}, 0)`);
        gradient.addColorStop(0.7, `rgba(${playerColor}, 0.2)`);
        gradient.addColorStop(1, `rgba(${playerColor}, 0.4)`);

        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.005) * 0.3;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, player.width / 2 + 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        shieldParticles.particles.filter(p => p.playerIndex === index).forEach(particle => {
            const x = centerX + Math.cos(particle.angle) * particle.distance;
            const y = centerY + Math.sin(particle.angle) * particle.distance;

            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    });
}