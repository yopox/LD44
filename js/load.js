class Load extends Phaser.Scene {

    constructor() {
        super('Load');
    }

    init() {
    }

    preload() {
        this.load.bitmapFont('EquipmentPro', 'assets/equipmentpro_medium_12.png', 'assets/equipmentpro_medium_12.fnt');
    }

    create() {
    }

    update() {
        this.scene.start("Title");
    }

}