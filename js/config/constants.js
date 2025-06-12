const soundEffects = {
    shoot: new Audio("../audio/shoot.mp3"),
    hit: new Audio("../audio/hit.mp3"),
    coin: new Audio("../audio/coin.mp3"),
    king: new Audio("../audio/king.mp3"),
    perfect: new Audio("../audio/perfect.mp3"),
    awesome: new Audio("../audio/awesome.mp3"),
    gameOver: new Audio("../audio/gameOver.mp3")
};

const volumes = {
    shoot: 0.3,
    hit: 0.7,
    coin: 0.4,
    king: 0.6,
    perfect: 0.5,
    awesome: 0.8,
    gameOver: 0.9
};

Object.keys(soundEffects).forEach(key => {
    soundEffects[key].volume = volumes[key] || 0.5;
    soundEffects[key].preload = 'auto';
});