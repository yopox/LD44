class Level extends Phaser.Scene {

    constructor() {
        super('Level');
        this.starfield;
        this.gState = GameState.TRANSITION_IN;
        this.transition;
        this.speed = 4;
    }

    init() {
    }

    create() {

        var worldBounds = new Phaser.Geom.Rectangle(0, 0, 3200, HEIGHT);
        this.impact.world.setBounds(0, 0, worldBounds.width, worldBounds.height);
        this.cameras.main.setBounds(0, 0, 3200, HEIGHT);
        this.cameras.main.scrollX = 0;

        this.starfield = new Starfield(this);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(
            this,
            WIDTH / 2,
            HEIGHT / 2,
            "sprPlayer"
        );

        this.transition = new Transition(this);
        this.transition.in();

    }

    update() {

        this.starfield.scroll(8);

        switch (this.gState) {
            case GameState.TRANSITION_IN:
                if (this.transition.ended) {
                    // End of the opening transition
                    this.gState = GameState.MAIN;
                }
                break;

            default:
                if (this.cursors.up.isDown && this.player.sprite.y > 18) {
                    this.player.moveUp();
                }
                else if (this.cursors.down.isDown && HEIGHT - this.player.sprite.y > 18) {
                    this.player.moveDown();
                }
                else {
                    this.player.stopY();
                }
                if (this.cursors.left.isDown && this.player.sprite.x > this.cameras.main.scrollX + 32) {
                    this.player.moveLeft();
                }
                else if (this.cursors.right.isDown && this.player.sprite.x < this.cameras.main.scrollX + WIDTH - 32) {
                    this.player.moveRight();
                }
                else {
                    this.player.stopX();
                }
                break;
            }
            
            this.cameras.main.scrollX += this.speed;
            this.player.sprite.body.pos.x += this.speed;

    }

    resetScene() {
    }

}