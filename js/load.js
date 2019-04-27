class Load extends Phaser.Scene {

    constructor() {
        super('Load');
    }

    init() {
    }

    preload() {
       
        this.load.image('star', 'assets/background.png');
        this.load.image('bigStar', 'assets/bigstar.png');
        this.load.image('ship', 'assets/jet.png');
        this.load.bitmapFont('EquipmentPro', 'assets/equipmentpro_medium_12.png', 'assets/equipmentpro_medium_12.fnt');
    }

    create() {
    }

    update() {
        this.scene.start("Title");
    }

}