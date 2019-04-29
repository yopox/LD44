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
		this.setMaxVelocity(300);
		this.isShooting = false;
		this.timerShootDelay = 20;
		this.timerShootTick = this.timerShootDelay;
		this.invincibility = 0;
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

		this.invincibility = this.invincibility > 0 ? this.invincibility - 1 : 0;
		this.alpha = 1-Math.floor(this.invincibility/10)%2;
		
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

class Chaser extends Entity {
	constructor(scene, x, y, life) {
		super(scene, x, y, 'tiles', 4);
		// this.setVelocityX(0);
		this.life = life;
		this.speed = 300;
		this.states = {
			MOVE_DOWN: "MOVE_DOWN",
			CHASE: "CHASE"
		};
		this.state = this.states.MOVE_DOWN;

	}

	update() {
		
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

			
			this.setVelocity(
				Math.cos(angle) * this.speed,
				Math.sin(angle) * this.speed
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

class Cargo extends Entity {
	constructor(scene, x, y, life) {
		super(scene, x, y, 'tiles', 5);
		// this.setVelocityX(0);
		this.life = life;
		this.speed = 50;
		this.counter = 0;
	}

	update() {
		this.counter += 1;
		this.setVelocity(
			-Math.abs(Math.cos(this.counter/10)) * this.speed,
			Math.sin(this.counter/10) * 3*this.speed
		);


	}
}

class Gunner extends Entity {
	constructor(scene, x, y, life) {
		super(scene, x, y, 'tiles', 6);
		// this.setVelocityX(0);
		this.life = life;
		this.speed = 150;
		this.timerShootDelay = 40;
		this.timerShootTick = this.timerShootDelay;
		this.invincibility = 0;
		this.setVelocityX(this.speed);
		
	}
	update() {

		if (this.timerShootTick < this.timerShootDelay) {
			this.timerShootTick += 1; // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
		}
		else { // when the "manual timer" is triggered:
			var laser = new EnemyLaser(this.scene, this.x , this.y + 8);
			this.scene.enemiesLasers.add(laser);
			this.timerShootTick = 0;
		}

	}
}

class PlayerLaser extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, "bullet", 0);
		this.body.offset.x = scene.speed;
		
		this.setVelocityX(400);
	}
}

class EnemyRocket extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, "bullet", 1);
		this.body.offset.x = scene.speed;
		
		this.setVelocityX(-400);
	}
}

class EnemyLaser extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, "bullet",2);
		this.body.offset.x = scene.speed;
		
		this.setVelocityX(-400);
	}
}


