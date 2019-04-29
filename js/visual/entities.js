class Entity extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, asset, frame = null, level = 0) {
		super(scene, x, y, asset, frame);
		this.life = 0;
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setMaxVelocity(400);

		switch (level) {
			case 0:
				this.life = 1;
				break;

			case 1:
				this.life = 3;
				this.setTint(0xccff0000);
				break;

			case 2:
				this.life = 6;
				this.setTint(0xcc0000ff);
				break;

			case 3:
				this.life = 10;
				this.setTint(0xccff0000);
				break;
		}

	}

}

class Player extends Entity {

	constructor(scene, x, y) {
		super(scene, x, y, "ship");
		this.speed = 2500;
		this.setMaxVelocity(250);
		this.isShooting = false;
		this.timerShootDelay = game.progress.tears;
		this.timerShootTick = 0;
		this.invincibility = 0;
	}

	moveX(factor) {
		this.setAccelerationX(factor * this.speed);
	}

	moveY(factor) {
		this.setAccelerationY(factor * this.speed);
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
		this.alpha = 1 - Math.floor(this.invincibility / 10) % 2;

		if (this.isShooting) {
			this.timerShootTick = (this.timerShootTick + 1) % this.timerShootDelay;
			if (this.timerShootTick == 0) {
				var laser = new PlayerLaser(this.scene, this.x + 37 - 24, this.y + 2);
				this.scene.playerLasers.add(laser);
			}
		}
	}
}

class Chaser extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy1', null, level);
		this.flipX = true;
		this.speed = 200;
		this.states = {
			MOVE_DOWN: "MOVE_DOWN",
			CHASE: "CHASE",
			ESCAPE: "ESCAPE"
		};
		this.state = this.states.MOVE_DOWN;
	}

	update() {

		if (this.scene.player.x > this.x) {
			this.state = this.states.ESCAPE;
		} else if (this.scene.player.x > this.x - WIDTH / 2) {
			this.state = this.states.CHASE;
		} else {
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
		} else if (this.state == this.states.ESCAPE) {
			this.setVelocityX(-100);
		}

	}
}

class Cargo extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy3', null, level);
		this.flipX = true;
		this.counter = 0;
		this.speed = 75;
	}

	update() {
		this.counter += 1;
		this.setVelocity(
			-Math.abs(Math.cos(this.counter / 10)) * this.speed,
			Math.sin(this.counter / 10) * 3 * this.speed
		);
	}
}

class Gunner extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy2', null, level);
		this.flipX = true;
		this.brake = 50;
		this.timerShootDelay = 70 - 10 * level;
		this.timerShootTick = this.timerShootDelay;
		this.setVelocityX(this.speed);
		this.states = {
			BRAKE: "BRAKE",
			MAIN: "MAIN"
		};
		this.state = this.states.MAIN;

	}
	update() {

		if (this.scene.player.x < this.x) {
			this.state = this.states.BRAKE;
		} else {
			this.state = this.states.MAIN
		}

		if (this.state == this.states.BRAKE) {
			this.setVelocityX(this.brake);
		} else if (this.state == this.states.MAIN) {
			this.setVelocityX(0);
		}

		if (this.timerShootTick < this.timerShootDelay) {
			this.timerShootTick += 1;
		}
		else {
			var laser = new EnemyLaser(this.scene, this.x - 57 + 14, this.y);
			this.scene.enemiesLasers.add(laser);
			this.timerShootTick = 0;
		}

	}
}

class FixedShooter extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy2', null, level);
		this.flipX = true;
		this.shootAngle = 0;
		this.delay = 70 - 10 * level;
		this.shootFrame = 0;
	}
	update() {

		this.shootFrame = (this.shootFrame + 1) % this.delay;
		if (this.shootFrame == 0) {
			for (let i = 0; i < 4; i++) {
				let angle = this.shootAngle + Math.PI / 2 * i;
				var laser = new EnemyLaser(this.scene, this.x - Math.cos(angle) * 29, this.y - 3 + Math.sin(angle) * 3, angle);
				this.scene.enemiesLasers.add(laser);
			}
			this.shootAngle = Math.PI / 4 - this.shootAngle;
		}

	}
}

class PlayerLaser extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, "bullet1");
		this.body.offset.x = scene.speed;
		this.setVelocityX(400);
	}
}

class EnemyRocket extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, "bullet2");
		this.flipX = true;
		this.body.offset.x = scene.speed;
		this.setVelocityX(-100 - scene.speed * 60);
	}
}

class EnemyLaser extends Entity {
	constructor(scene, x, y, angle = 0) {
		super(scene, x, y, "bullet2");
		this.flipX = true;
		this.body.offset.x = scene.speed;
		let velocity = -100 - scene.speed * 60;
		this.setVelocity(velocity * Math.cos(angle), velocity * Math.sin(angle));
		this.setAngle(180 * angle / Math.PI);
	}
}
