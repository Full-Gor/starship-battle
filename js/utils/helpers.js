function generatePseudo() {
    const adjectives = ['Rapide', 'Brillant', 'Furtif', 'Cosmique', 'Étoile', 'Galactique', 'Astral', 'Solaire'];
    const nouns = ['Vaisseau', 'Pilote', 'Guerrier', 'Explorateur', 'Comète', 'Nébuleuse', 'Chasseur', 'Éclaireur'];
    const number = Math.floor(Math.random() * 999) + 1;
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}${noun}${number}`;
}

function getAssistantColor(imageIndex) {
    const colors = ['#FF4444', '#4444FF', '#44FF44', '#FFFF44', '#FF44FF', '#44FFFF'];
    return colors[imageIndex % colors.length];
}