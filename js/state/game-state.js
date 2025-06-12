const starshipImg = new Image();
starshipImg.src = '../img/starship7.jpg';
const starship2Img = new Image();
starship2Img.src = '../img/starship6.jpg';

const powerUpImgs = [];
for (let i = 0; i < 3; i++) {
    powerUpImgs[i] = new Image();
    powerUpImgs[i].src = '../img/powerUp' + (i === 0 ? '' : i) + '.jpg';
}

const livesImg = new Image();
livesImg.src = '../img/lives.jpg';

const thunderImgs = [];
for (let i = 0; i < 3; i++) {
    thunderImgs[i] = new Image();
    thunderImgs[i].src = '../img/thunderImgs' + (i + 1) + '.jpg';
}

const assistantShipImgs = [];
for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `../img/starship${i}.jpg`;
    assistantShipImgs.push(img);
}