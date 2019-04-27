class Load extends Phaser.Scene {

    constructor() {
        super('Load');
    }

    init() {
    }

    preload() {
       
        this.load.image('star', 'assets/graphics/background.png');
        this.load.image('door', 'assets/graphics/door.png');
        this.load.spritesheet('stars', 'assets/graphics/stars.png', { frameWidth: 8, frameHeight: 8 });
        this.load.image('ship', 'assets/graphics/jet.png');
        this.load.bitmapFont('EquipmentPro', 'assets/font/equipmentpro_medium_12.png', 'assets/font/equipmentpro_medium_12.fnt');
        this.load.tilemapTiledJSON('map', 'assets/maps/map1.json');
    }

    create() {
    }

    update() {
        this.scene.start("Title");
    }

}