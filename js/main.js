const WIDTH = 640;
const HEIGHT = 380;

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
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