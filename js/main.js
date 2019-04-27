var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'impact',
        impact: {
            gravity: 0
        }
    },
    pixelArt: true,
    scene: [Load, Level]
};

var game = new Phaser.Game(config);