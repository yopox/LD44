class Entity extends Phaser.GameObjects.Sprite {
    
    

    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);
        console.log(this)
        this.scene = scene;
        this.player = scene.impact.add.sprite(x, y, type);
        this.setData("type", type);
        this.setData("isDead", false);
    }
  }

  class Player extends Entity {

    constructor(scene, x, y, key, type) {
        super(scene, x, y, key, "ship");
        this.setData("speed", 5000);
        this.player.setMaxVelocity(1000).setFriction(80, 600)
       
    }

    moveUp() {
        this.player.setAccelerationY(-this.getData("speed"));
      }
    moveDown() {
        this.player.setAccelerationY( this.getData("speed"));
      }
    moveLeft() {
        this.player.setAccelerationX(-this.getData("speed"));
      }
    moveRight() {
        this.player.setAccelerationX(this.getData("speed"));
      }
    stopX() {
        this.player.setAccelerationX(0)
        this.player.setVelocityX(0);
    }
    stopY() {
        this.player.setAccelerationY(0)
        this.player.setVelocityY(0);
    }

      update(){
        //this.player.setVelocity(0, 0);
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
      }
  }