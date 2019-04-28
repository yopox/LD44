class Level extends Phaser.Scene {

    constructor() {
        super('Level');
        this.starfield;
        this.gState;
        this.transition;
        this.speed;
        this.targetSpeed;
        this.map;
        this.speedModif;
        this.victoryX;
    }

    create() {
        this.gState = GameState.TRANSITION_IN;
        this.speed = 30;
        this.targetSpeed = 30;
        this.starfield = new Starfield(this);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(
            this,
            WIDTH / 6,
            HEIGHT / 2,
            "ship"
        );


        // Tilemap loading
        this.map = this.make.tilemap({ key: 'map' });
        console.log(this.map);

        var mapObjects = this.map.getObjectLayer("objects").objects;
        this.speedModif = [];
        this.enemiesTiled = [];
        mapObjects.forEach(obj => {
            if (obj.gid < 5) {
                // Speed modifiers
                this.speedModif.push(obj);
            }
            else if (obj.gid == 5) {
                this.enemiesTiled.push(obj)
            }
        });
        this.speedModif.sort(function (a, b) { return a.x - b.x });
        this.enemiesTiled.sort(function (a, b) { return a.x - b.x });
        this.impact.world.setBounds(0, 0, this.map.widthInPixels, HEIGHT);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, HEIGHT);
        this.victoryX = this.map.widthInPixels - 256;

        this.transition = new Transition(this);
        this.transition.in();

        this.playerLasers = this.add.group();
        this.enemiesSprite = this.add.group();

    }

    update() {
        this.updateSpeed();
        this.updateEnemies()
        this.starfield.scroll(2 * this.speed + 1);

        switch (this.gState) {
            case GameState.TRANSITION_IN:
                if (this.transition.ended) {
                    // End of the opening transition
                    this.gState = GameState.MAIN;
                    this.transition.ended = false;
                }
                break;

            case GameState.WINNING_STATE:
                if (this.player.sprite.body.pos.x > this.victoryX + 128) {
                    this.gState = GameState.TRANSITION_OUT;
                    this.transition.out();
                }
                break;

            case GameState.TRANSITION_OUT:
                if (this.transition.ended) {
                    this.resetScene();
                    this.scene.start("Title");
                    return false;
                }
                break;

            default:
                if (this.cursors.up.isDown && this.player.sprite.y > 18) {
                    this.player.moveUp();
                }
                else if (this.cursors.down.isDown && HEIGHT - this.player.sprite.y > 18) {
                    this.player.moveDown();
                }
                else {
                    this.player.stopY();
                }
                if (this.cursors.left.isDown && this.player.sprite.x > this.cameras.main.scrollX + 32) {
                    this.player.moveLeft();
                }
                else if (this.cursors.right.isDown && this.player.sprite.x < this.cameras.main.scrollX + WIDTH - 32) {
                    this.player.moveRight();
                }
                else {
                    this.player.stopX();
                }
                if (this.cursors.space.isDown) {
                    this.player.isShooting = true;

                }
                else {
                    //this.player.timerShootTick = this.timerShootDelay ;
                    this.player.isShooting = false;
                }
                this.player.update()
                break;
        }

        this.cameras.main.scrollX += this.speed;
        this.player.sprite.body.pos.x += this.speed;

        this.playerLasers.getChildren().forEach(laser => {
            laser.sprite.body.pos.x += this.speed;
        });
        this.playerLasers.getChildren().forEach(laser => {
            if (laser.sprite.body.pos.x > this.cameras.main.scrollX + WIDTH + 16) {
                this.playerLasers.remove(laser);
                laser.sprite.destroy();
                laser.destroy();
            }
        });
        this.enemiesSprite.getChildren().forEach(enemy => {
            enemy.sprite.body.pos.x += 2 * this.speed / 3;
            enemy.update();
        });



        // Winning condition
        if (this.player.sprite.body.pos.x > this.victoryX && this.gState == GameState.MAIN) {
            this.gState = GameState.WINNING_STATE;
            this.player.sprite.setVelocityX(300);
            console.log('winning');
            this.player.isShooting = false;
        }

    }

    resetScene() {
        this.speedModif = [];
        this.starfield.destroy();
        this.player.sprite.destroy();
    }

    updateSpeed() {
        if (this.speedModif.length && this.speedModif[0].x < this.player.sprite.body.pos.x) {
            var sM = this.speedModif.shift();
            var speed = (sM.gid - 1) * 4;
            console.log("new speed : " + speed);
            this.targetSpeed = speed;
        }

        if (this.speed < this.targetSpeed) {
            this.speed += 1;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 1;
        }
    }

    updateEnemies() {

        if (this.enemiesTiled.length && this.enemiesTiled[0].x < this.player.sprite.body.pos.x + 2 * WIDTH) {
            // console.log(this.enemiesTiled[0].x)
            var enemyBeam = this.enemiesTiled.shift();

            if (enemyBeam.gid == 5) {
                var enemy = new Pizza(
                    this,
                    enemyBeam.x,
                    enemyBeam.y
                );

                this.enemiesSprite.add(enemy)
            }
        }
    }
}