class Entity extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, asset, frame = null) {
		super(scene, x, y, asset, frame);
		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

}


class Player extends Entity {

	constructor(scene, x, y) {
		super(scene, x, y, "ship");
		this.speed = 5000;

		// this.setMaxVelocity(300);
		this.isShooting = false;
		this.timerShootDelay = 40;
		this.timerShootTick = this.timerShootDelay;
	}

	moveUp() {
		this.setAccelerationY(-this.speed);
	}
	moveDown() {
		this.setAccelerationY(this.speed);
	}
	moveLeft() {
		this.setAccelerationX(-this.speed);
	}
	moveRight() {
		this.setAccelerationX(this.speed);
	}
	stopX() {
		this.setAccelerationX(0)
		this.setVelocityX(0);
	}
	stopY() {
		this.setAccelerationY(0)
		this.setVelocityY(0);
	}
	update() {

		if (this.isShooting) {
			if (this.timerShootTick < this.timerShootDelay) {
				this.timerShootTick += 1; // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
			}
			else { // when the "manual timer" is triggered:
				var laser = new PlayerLaser(this.scene, this.x + 32, this.y + 8);
				this.scene.playerLasers.add(laser);
				this.timerShootTick = 0;
			}
		}

	}
}

class Pizza extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, 'tiles', 4);
		// this.setVelocityX(0);

		this.states = {
			MOVE_DOWN: "MOVE_DOWN",
			CHASE: "CHASE"
		};
		this.state = this.states.MOVE_DOWN;

	}

	update() {
		if (!this.isDead && this.scene.player) {
			if (Phaser.Math.Distance.Between(
				this.x,
				this.y,
				this.scene.player.x,
				this.scene.player.y
			) < 320 && this.scene.player.x < this.x) {

				this.state = this.states.CHASE;
			}
			else {
				this.state = this.states.MOVE_DOWN
			}

			if (this.state == this.states.CHASE) {
				var dx = this.scene.player.x - this.x;
				var dy = this.scene.player.y - this.y;

				var angle = Math.atan2(dy, dx);

				var speed = 300;
				this.setVelocity(
					Math.cos(angle) * speed,
					Math.sin(angle) * speed
				);

				if (this.x < this.scene.player.x) {
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
		this.setMaxVelocity(300);
		this.setVelocityX(600);
	}
}
