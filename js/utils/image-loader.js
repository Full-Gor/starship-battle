// image-loader.js - Chargeur d'images

const ImageLoader = {
    images: {},
    loaded: false,
    loadedCount: 0,
    totalCount: 0,
    
    loadAll: function() {
        const imagesToLoad = {
            starship1: 'assets/img/starship7.jpg',
            starship2: 'assets/img/starship6.jpg',
            powerUp0: 'assets/img/powerUp.jpg',
            powerUp1: 'assets/img/powerUp1.jpg',
            powerUp2: 'assets/img/powerUp2.jpg',
            lives: 'assets/img/lives.jpg',
            thunder1: 'assets/img/thunderImgs1.jpg',
            thunder2: 'assets/img/thunderImgs2.jpg',
            thunder3: 'assets/img/thunderImgs3.jpg',
            assistant1: 'assets/img/starship1.jpg',
            assistant2: 'assets/img/starship2.jpg',
            assistant3: 'assets/img/starship3.jpg',
            assistant4: 'assets/img/starship4.jpg',
            assistant5: 'assets/img/starship5.jpg',
            assistant6: 'assets/img/starship6.jpg'
        };
        
        this.totalCount = Object.keys(imagesToLoad).length;
        
        Object.entries(imagesToLoad).forEach(([key, path]) => {
            const img = new Image();
            img.onload = () => {
                this.loadedCount++;
                console.log(`Image chargée: ${key} (${this.loadedCount}/${this.totalCount})`);
                
                if (this.loadedCount === this.totalCount) {
                    this.loaded = true;
                    console.log('✅ Toutes les images sont chargées');
                }
            };
            
            img.onerror = () => {
                console.error(`❌ Erreur chargement image: ${key}`);
                this.loadedCount++;
            };
            
            img.src = path;
            this.images[key] = img;
        });
    },
    
    get: function(name) {
        return this.images[name] || null;
    },
    
    isReady: function() {
        return this.loaded;
    }
};