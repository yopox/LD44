class Entity extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, key, type = 0) {
    super(scene, x, y, key);

    this.scene = scene;
    this.sprite = this.scene.physics.add.sprite(x, y, key,type);
    this.isDead = false;
  }

  
}


class Player extends Entity {

  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);  
    this.speed = 5000;
    this.sprite.setMaxVelocity(300);
    this.isShooting = false;
    this.timerShootDelay = 40;
    this.timerShootTick = this.timerShootDelay ;
  }

  moveUp() {
    this.sprite.setAccelerationY(-this.speed);
  }
  moveDown() {
    this.sprite.setAccelerationY(this.speed);
  }
  moveLeft() {
    this.sprite.setAccelerationX(-this.speed);
  }
  moveRight() {
    this.sprite.setAccelerationX(this.speed);
  }
  stopX() {
    this.sprite.setAccelerationX(0)
    this.sprite.setVelocityX(0);
  }
  stopY() {
    this.sprite.setAccelerationY(0)
    this.sprite.setVelocityY(0);
  }
  update() {

    if (this.isShooting) {
      if (this.timerShootTick < this.timerShootDelay) {
        this.timerShootTick += 1; // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      }
      else { // when the "manual timer" is triggered:
        var laser = new PlayerLaser(this.scene, this.sprite.x + 32, this.sprite.y + 8);
        this.scene.playerLasers.add(laser);
        this.timerShootTick = 0;
      }
    }

  }
}

class Pizza extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "tiles", 4);
    
    this.sprite.setVelocityX (0);

    this.states = {
      MOVE_DOWN: "MOVE_DOWN",
      CHASE: "CHASE"
    };
    this.state = this.states.MOVE_DOWN;
    
  }

  update() {
    if (!this.isDead && this.scene.player) {
      if (Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        this.scene.player.sprite.x,
        this.scene.player.sprite.y
      ) < 320 && this.scene.player.sprite.x < this.sprite.x) {

        this.state = this.states.CHASE;
      }
      else  {
        this.state = this.states.MOVE_DOWN
      }

      if (this.state == this.states.CHASE) {
        var dx = this.scene.player.sprite.x - this.sprite.x;
        var dy = this.scene.player.sprite.y - this.sprite.y;

        var angle = Math.atan2(dy, dx);

        var speed = 300;
        this.sprite.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );

        if (this.sprite.x < this.scene.player.sprite.x) {
          this.angle -= 5;
        }
        else {
          this.angle += 5;
        } 
      }
    }
  }
}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.sprite.setMaxVelocity(300);
    this.sprite.setVelocityX(600);
    
  }
}
