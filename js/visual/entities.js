// Boss behavior
// 0 - 100 : rien
// 100 - 190 : simple tir
// 190 - 270 : rien
// fin : tir double

class Entity extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, asset, frame = null, level = 0) {
		super(scene, x, y, asset, frame);
		this.life = 0;
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setMaxVelocity(400);
		this.killFrames = 0;
		this.isAsteroid = false;

		switch (level) {
			case 0:
				this.life = 1;
				break;
			case 1:
				this.life = 3;
				this.setTint(0xcc0000ff);
				break;
			case 2:
				this.life = 6;
				this.setTint(0xccff0000);
				break;
			case 3:
				this.life = 10;
				this.setTint(0xcc00ff00);
				break;
		}
	}

	update() {
		if (this.life <= 0) {
			if (this.alpha == 0) {
				this.setActive(false);
			} else {
				this.alpha = this.alpha - 0.2;
			}
		}
	}

}

class Bonus extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, 'cosmonaut', 0);
		this.counter = 0;
		this.speed = 10;
	}

	update() {
		this.counter += 1;
		this.setVelocityY(Math.cos(this.counter / 30) * this.speed);
		this.setFrame(Math.floor(Math.pow(Math.cos(this.counter / 20), 2) * 3));
	}
}

class Player extends Entity {

	constructor(scene, x, y) {
		super(scene, x, y, "ship");
		this.speed = 2500;
		this.setMaxVelocity(game.progress.stats[0]);
		this.isShooting = false;
		this.timerShootDelay = game.progress.stats[2];
		this.timerShootTick = 0;
		this.invincibility = 0;
		this.shotsNo = game.progress.stats[3];
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

		this.timerShootTick = (this.timerShootTick + 1) % this.timerShootDelay;
		if (this.timerShootTick == 0) {
			switch (this.shotsNo) {
				case 1:
					var laser = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2);
					this.scene.playerLasers.add(laser);
					break;
				case 2:
					var laser1 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, Math.PI / 14);
					this.scene.playerLasers.add(laser1);
					var laser2 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, -Math.PI / 14);
					this.scene.playerLasers.add(laser2);
					break;
				case 3:
					var laser1 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, Math.PI / 10);
					this.scene.playerLasers.add(laser1);
					var laser2 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, 0);
					this.scene.playerLasers.add(laser2);
					var laser3 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, -Math.PI / 10);
					this.scene.playerLasers.add(laser3);
					break;
				case 4:
					var laser1 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, Math.PI / 8);
					this.scene.playerLasers.add(laser1);
					var laser2 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, Math.PI / 16);
					this.scene.playerLasers.add(laser2);
					var laser3 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, -Math.PI / 16);
					this.scene.playerLasers.add(laser3);
					var laser4 = new PlayerLaser(this.scene, this.x + 37 - 20, this.y + 2, -Math.PI / 8);
					this.scene.playerLasers.add(laser4);
					break;
			}
			
		}
	}
}

class Asteroid extends Entity {
	constructor(scene, x, y, type = 0) {
		super(scene, x, y, 'asteroids', type);
		this.isAsteroid = true;
		this.body.setMass(4);
		this.life = 15;
		switch (type) {
			case 0:
				this.body.setSize(28, 26, true);
				break;
			case 1:
				this.body.setSize(17, 11, true);
				break;
			case 2:
				this.body.setSize(11, 27, true);
				break;
			case 3:
				this.body.setSize(16, 10, true);
				break;
		}
	}

}

class Boss extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'boss');
		this.states = {
			NOTHING: "NOTHING",
			SIMPLE_SHOT: "SIMPLE_SHOT",
			DOUBLE_SHOT: "DOUBLE_SHOT",
			DEATH: "DEATH"
		};
		this.scene = scene;
		this.state = this.states.NOTHING;
		this.timerShootTick = 0;
		this.timerShootDelay = 50;
		this.mark1 = 100 * 32;
		this.mark2 = 190 * 32;
		this.mark3 = 270 * 32;
		this.mark4 = 450 * 32;
		this.setVelocityX(-2);
	}

	update() {
		this.x += this.scene.speed;

		if (this.x > this.mark1 && this.x < this.mark2) {
			this.state = this.states.SIMPLE_SHOT;
		} else if (this.x > this.mark2 && this.x < this.mark3) {
			this.state = this.states.NOTHING
		} else if (this.x > this.mark3 && this.x < this.mark4) {
			this.state = this.states.DOUBLE_SHOT
		} else if (this.x > this.mark4) {
			this.state = this.states.DEATH
		}

		if (this.timerShootTick < this.timerShootDelay) {
			this.timerShootTick += 1;
		}
		else {
			if (this.state == this.states.SIMPLE_SHOT) {
				var laser = new EnemyLaser(this.scene, this.x - 76 + 14, this.y + 2);
				this.scene.enemiesLasers.add(laser);
			} else if (this.state == this.states.DOUBLE_SHOT) {
				var laser1 = new EnemyLaser(this.scene, this.x - 76 + 14, this.y + 2, Math.PI / 8);
				this.scene.enemiesLasers.add(laser1);
				var laser2 = new EnemyLaser(this.scene, this.x - 76 + 14, this.y + 2, -Math.PI / 8);
				this.scene.enemiesLasers.add(laser2);
			}
			this.timerShootTick = 0;
		}

	}
}

class Chaser extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy1', null, level);
		this.flipX = true;
		this.speed = 150;
		this.states = {
			MOVE_DOWN: "MOVE_DOWN",
			CHASE: "CHASE",
			ESCAPE: "ESCAPE"
		};
		this.state = this.states.MOVE_DOWN;
	}

	update() {
		super.update();
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
		super.update();
		this.counter += 1;
		this.setVelocity(
			-Math.abs(Math.cos(this.counter / 10)) * this.speed,
			Math.sin(this.counter / 10) * 3 * this.speed
		);
	}
}

class Cargo2 extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy5', null, level);
		this.counter = 0;
		this.speed = 300;
		this.setVelocityX(-25);
	}

	update() {
		super.update();
		this.counter += 1;
		this.setVelocityY(Math.cos(this.counter / 10) * 3 * this.speed);
	}
}

class Gunner extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy6', null, level);
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
		super.update();
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
			var laser = new EnemyLaser(this.scene, this.x - 30 + 14, this.y);
			this.scene.enemiesLasers.add(laser);
			this.timerShootTick = 0;
		}

	}
}

class DualShooter extends Entity {
	constructor(scene, x, y, level = 0) {
		super(scene, x, y, 'enemy4', null, level);
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
		super.update();
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
			var laser = new EnemyLaser(this.scene, this.x - 21 + 14, this.y, Math.PI / 12);
			this.scene.enemiesLasers.add(laser);
			var laser = new EnemyLaser(this.scene, this.x - 21 + 14, this.y, -Math.PI / 12);
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
		super.update();
		this.shootFrame = (this.shootFrame + 1) % this.delay;
		if (this.shootFrame == 0) {
			for (let i = 0; i < 4; i++) {
				let angle = this.shootAngle + Math.PI / 2 * i;
				var laser = new EnemyLaser(this.scene, this.x - Math.cos(angle) * 29, this.y - 3 + Math.sin(angle) * 3, angle);
				if (!angle == Math.PI)
					this.scene.enemiesLasers.add(laser);
			}
			this.shootAngle = Math.PI / 4 - this.shootAngle;
		}

	}
}

class PlayerLaser extends Entity {
	constructor(scene, x, y, angle = 0) {
		super(scene, x, y, "bullets", 0);
		this.body.offset.x = scene.speed;
		this.setVelocity(400 * Math.cos(angle), 400 * Math.sin(angle));
		this.setAngle(angle);
		this.frameNo = 0;
	}

	update(spd) {
		this.frameNo++;
		if (this.frameNo > 4) {
			this.setFrame(2);
		} else if (this.frameNo >= 2) {
			this.setFrame(1);
		}
		this.x += spd;
	}
}

class EnemyLaser extends Entity {
	constructor(scene, x, y, angle = 0) {
		super(scene, x, y, "bullets", 10);
		this.flipX = true;
		this.body.offset.x = scene.speed;
		let velocity = -100 - scene.speed * 60;
		this.setVelocity(velocity * Math.cos(angle), velocity * Math.sin(angle));
		this.setAngle(180 * angle / Math.PI);
		this.frameNo = 0;
	}

	update() {
		this.frameNo++;
		if (this.frameNo > 4) {
			this.setFrame(12);
		} else if (this.frameNo >= 2) {
			this.setFrame(11);
		}
	}
}
