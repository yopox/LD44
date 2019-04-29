const WIDTH = 640;
const HEIGHT = 380;

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0
        }
    },
    zoom: 2,
    scene: [Load, Title, Diary, Planets, Shop, Level]
};

var game = new Phaser.Game(config);
game.progress = new Progress();

var GameState = {
    TRANSITION_IN: 1,
    TRANSITION_OUT: 2,
    MAIN: 3,
    WINNING_STATE: 4
};

function mod(n, m) {
    return ((n % m) + m) % m;
}
