class Load extends Phaser.Scene {

    constructor() {
        super('Load');
    }

    preload() {

        this.load.image('bullet1', 'assets/graphics/bullet_1.png');
        this.load.image('bullet2', 'assets/graphics/bullet_2.png');
        this.load.spritesheet('cursor', 'assets/graphics/cursor.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('door', 'assets/graphics/door.png');
        this.load.image('diary', 'assets/graphics/diary.png');
        this.load.image('shop', 'assets/graphics/shop.png');
        this.load.image('map', 'assets/graphics/map.png');
        this.load.spritesheet('stars', 'assets/graphics/stars.png', { frameWidth: 8, frameHeight: 8 });
        this.load.spritesheet('tiles', 'assets/graphics/tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('cosmonaut', 'assets/graphics/cosmonaut.png', { frameWidth: 12, frameHeight: 12 });
        this.load.spritesheet('asteroids', 'assets/graphics/asteroids.png', { frameWidth: 70, frameHeight: 70 });
        this.load.spritesheet('bullets', 'assets/graphics/bullets.png', { frameWidth: 24, frameHeight: 9 });
        this.load.image('ship', 'assets/graphics/jet.png');
        this.load.image('boss', 'assets/graphics/boss.png');
        this.load.image('shopCursor', 'assets/graphics/shopCursor.png');
        this.load.bitmapFont('EquipmentPro', 'assets/font/equipmentpro_medium_12.png', 'assets/font/equipmentpro_medium_12.fnt');

        for (let i = 1; i < 7; i++) {
            this.load.tilemapTiledJSON('map' + i, 'assets/maps/map' + i + '.json');
        }

        for (let i = 1; i < 7; i++) {
            this.load.image('enemy' + i, 'assets/graphics/enemy_' + i + '.png');
        }

        for (let i = 1; i < 6; i++) {
            this.load.audio('type' + i, 'assets/sfx/type' + i + '.ogg');
        }

        let bgmKeys = ['planets', 'shop', 'diary', 'easy', 'medium', 'hard'];

        for (let i = 1; i <= bgmKeys.length; i++) {
            this.load.audio(bgmKeys[i-1], 'assets/bgm/' + i + '.ogg');
        }

    }

    update() {
        this.scene.start("Title");
    }

}