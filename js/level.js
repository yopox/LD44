class Level extends Phaser.Scene {

    constructor() {
        super('Level');
    }

    init() {
    }

    create() {
        
        var worldBounds = new Phaser.Geom.Rectangle(0, 0, 3200, HEIGHT);
        this.impact.world.setBounds(0, 0, worldBounds.width, worldBounds.height);
         //  The world is 3200 x 600 in size
        this.cameras.main.setBounds(0, 0, 3200, HEIGHT);

        
        this.cameras.main.scrollX = 0;
        
        //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
        // this.minimap = this.cameras.add(200, 10, 400, 100).setZoom(0.2);
        // this.minimap.setBackgroundColor(0x002244);
        // this.minimap.scrollX = 1600;
        // this.minimap.scrollY = 300;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(
            this,
            WIDTH/2,
            HEIGHT/2,
            "sprPlayer"
          ); 

        this.wallbefore = this.impact.add.body(0, 0, 1, HEIGHT).setFixedCollision().setGravity(0).setVelocityX(200);
        this.wallafter = this.impact.add.body(WIDTH -1, 0, WIDTH, HEIGHT).setFixedCollision().setGravity(0).setVelocityX(200);
        //this.cameras.startFollow(this.wallbefore,false,1,1,WIDTH/2,HEIGHT/2);
        
    }

    update() {
        
        if (this.cursors.up.isDown) {
            this.player.moveUp();
        }
        else if (this.cursors.down.isDown) {
            this.player.moveDown();
        }
        else {
            this.player.stopY()
        }
        if (this.cursors.left.isDown) {
            this.player.moveLeft();
        }
        else if (this.cursors.right.isDown) {
            this.player.moveRight();
        }
        else {
            this.player.stopX()
        }
        this.cameras.main.scrollX = this.wallbefore.body.pos.x ;
        
       
        
    }

    resetScene() {
    }

}