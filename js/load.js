fontReady = false;

class Load extends Phaser.Scene {

    constructor() {
        super('Load');
    }

    init() {
        var element = document.createElement('style');
        document.head.appendChild(element);
        var sheet = element.sheet;
        var styles = '@font-face { font-family: "EquipmentPro"; src: url("assets/EquipmentPro.ttf") format("truetype"); }\n';
        sheet.insertRule(styles, 0);
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        WebFont.load({
            custom: {
                families: ['EquipmentPro']
            },
            active: function () {
                fontReady = true;
            }
        });
    }

    update() {
        if (fontReady) {
            this.scene.start("Level");
        }
    }

}