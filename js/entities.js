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
    this.speed = 5000;
    this.sprite.setMaxVelocity(300).setActiveCollision().setAvsB()
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

}
