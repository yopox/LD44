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

var GameState = {
    TRANSITION_IN: 1,
    TRANSITION_OUT: 2,
    MAIN: 3,
  };