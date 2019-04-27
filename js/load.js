class Load extends Phaser.Scene {

    constructor() {
        super('Load');
    }

    init() {
    }

    preload() {
       
        this.load.image('star', 'assets/background.png');
        this.load.spritesheet('stars', 'assets/stars.png', { frameWidth: 8, frameHeight: 8 });
        this.load.image('ship', 'assets/jet.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.bitmapFont('EquipmentPro', 'assets/equipmentpro_medium_12.png', 'assets/equipmentpro_medium_12.fnt');
    }

    create() {
    }

    update() {
        this.scene.start("Title");
    }

}