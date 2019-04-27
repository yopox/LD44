var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 380,
    physics: {
        default: 'impact',
        impact: {
            gravity: 0
        }
    },
    pixelArt: true,
    scene: [Load, Title, Level]
};

var game = new Phaser.Game(config);