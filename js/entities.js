class Entity extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.sprite = scene.impact.add.sprite(x, y, type);

    this.setData("isDead", false);
  }
}


class Player extends Entity {

  constructor(scene, x, y, key, type) {
    super(scene, x, y, key, "ship");
    this.speed = 5000;
    this.sprite.setMaxVelocity(300).setActiveCollision().setAvsB()
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
        var laser = new PlayerLaser(this.scene, this.sprite.body.pos.x + 32, this.sprite.body.pos.y + 8);
        this.scene.playerLasers.add(laser);
        this.timerShootTick = 0;
      }
    }

  }
}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserPlayer", "bullet");
    this.sprite.setMaxVelocity(300);
    this.sprite.setVelocityX(600);
    
  }
}
