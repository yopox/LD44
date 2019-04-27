class Entity extends Phaser.GameObjects.Sprite {
    
    

    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);
        console.log(this)
        this.scene = scene;
        this.sprite = scene.impact.add.sprite(x, y, type);
        
        this.setData("isDead", false);
    }
  }

  class Player extends Entity {

    constructor(scene, x, y, key, type) {
        super(scene, x, y, key, "ship");
        this.setData("speed", 5000);
        this.sprite.setMaxVelocity(1000).setFriction(80, 600)
        this.sprite.setActiveCollision().setAvsB()
       
    }

    moveUp() {
        this.sprite.setAccelerationY(-this.getData("speed"));
      }
    moveDown() {
        this.sprite.setAccelerationY( this.getData("speed"));
      }
    moveLeft() {
        this.sprite.setAccelerationX(-this.getData("speed"));
      }
    moveRight() {
        this.sprite.setAccelerationX(this.getData("speed"));
      }
    stopX() {
        this.sprite.setAccelerationX(0)
        this.sprite.setVelocityX(0);
    }
    stopY() {
        this.sprite.setAccelerationY(0)
        this.sprite.setVelocityY(0);
    }

    update(scrollingspeed){
        //this.sprite.setVelocity(0, 0);
        //this.sprite.x += scrollingspeed
        //console.log("before", this.sprite.x)
        //this.sprite.setPosition(Phaser.Math.Clamp(this.sprite.x, this.scene.cameras.main.scrollX+20, this.scene.cameras.main.scrollX + 580), Phaser.Math.Clamp(this.sprite.y, 0, this.scene.game.config.height))
        this.sprite.x =  Phaser.Math.Clamp(this.sprite.x, this.scene.cameras.main.scrollX   , this.scene.cameras.main.scrollX );
        //console.log("e",this.sprite.x)
        this.sprite.y =  Phaser.Math.Clamp(this.sprite.y, 0, this.scene.game.config.height);
      }
  }