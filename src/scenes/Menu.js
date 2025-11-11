import Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        document.querySelectorAll(".game-ui").forEach(el => el.remove());

        this.add.text(400, 200, 'Binary Tree Builder', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const start = this.add.text(400, 350, 'Start (Normal Mode)', {
            fontSize: '28px',
            backgroundColor: '#AAFF00',
            padding: { x: 20, y: 10 },
            color: '#000'
        }).setOrigin(0.5).setInteractive();

        start.on('pointerdown', () => {
            this.scene.start('InputTestScene');        
        });

        const rotations = this.add.text(400, 450, 'Start (Rotation Mode)', {
            fontSize: '28px',
            backgroundColor: '#ffcc00',
            padding: { x: 20, y: 10 },
            color: '#000'
        }).setOrigin(0.5).setInteractive();

        rotations.on('pointerdown', () => {
            this.scene.start('RotationGame');        
        });

    }
}
