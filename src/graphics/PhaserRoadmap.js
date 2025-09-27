import Phaser from "phaser";
export class RoadmapScene extends Phaser.Scene {
    constructor() { super({ key: 'RoadmapScene' }); }
    preload() {
        this.load.image('roadmap', '/roadmap.webp');
        this.load.image('level', 'https://phaser.io/images/logo.png');
    }
    create() {
        this.add.image(240, 110, 'roadmap').setDisplaySize(480, 220);
        // Level circles and connectors
        this.add.line(0, 0, 86, 120, 230, 77, 0x22d3ee).setLineWidth(6);
        this.add.line(0, 0, 230, 77, 374, 120, 0x22d3ee).setLineWidth(6);
        this.add.image(86, 120, 'level').setInteractive().setDisplaySize(56, 56);
        this.add.image(230, 77, 'level').setInteractive().setDisplaySize(56, 56);
        this.add.image(374, 120, 'level').setInteractive().setDisplaySize(56, 56);
        // Add more animation or effects as needed
    }
}
