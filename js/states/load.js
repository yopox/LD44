class Load extends Phaser.Scene {

    constructor() {
        super('Load');
    }

    preload() {


        this.load.spritesheet('bullet', 'assets/graphics/bullet.png', { frameWidth: 24, frameHeight: 10 });
        this.load.spritesheet('cursor', 'assets/graphics/cursor.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('star', 'assets/graphics/background.png');
        this.load.image('door', 'assets/graphics/door.png');
        this.load.image('diary', 'assets/graphics/diary.png');
        this.load.image('shop', 'assets/graphics/shop.png');
        this.load.image('map', 'assets/graphics/map.png');
        this.load.spritesheet('stars', 'assets/graphics/stars.png', { frameWidth: 8, frameHeight: 8 });
        this.load.spritesheet('tiles', 'assets/graphics/tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('ship', 'assets/graphics/Enemy ship 1.png');
        this.load.bitmapFont('EquipmentPro', 'assets/font/equipmentpro_medium_12.png', 'assets/font/equipmentpro_medium_12.fnt');
        this.load.tilemapTiledJSON('map', 'assets/maps/map1.json');

        for (let i = 1; i < 6; i++) {
            this.load.audio('type' + i, 'assets/sfx/type' + i + '.ogg');
        }
        this.load.audio('diary', 'assets/bgm/diary.ogg');
        this.load.audio('planets', 'assets/bgm/planets.ogg');

    }

    update() {
        this.scene.start("Title");
    }

}