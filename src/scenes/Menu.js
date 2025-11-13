import Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        document.querySelectorAll(".game-ui").forEach(el => el.remove());

        this.add.text(750, 200, 'Binary Tree Builder', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const Level1 = this.add.text(400, 350, 'Test Scene 1', {
            fontSize: '28px',
            backgroundColor: '#AAFF00',
            padding: { x: 10, y: 10 },
            color: '#000'
        }).setOrigin(0.5).setInteractive();

        Level1.on('pointerdown', () => {
            this.scene.start('InputTestScene');        
        });

        const Level2 = this.add.text(700, 350, 'Test Scene 2', {
            fontSize: '28px',
            backgroundColor: '#ffcc00',
            padding: { x: 20, y: 10 },
            color: '#000'
        }).setOrigin(0.5).setInteractive();

        Level2.on('pointerdown', () => {
            this.scene.start('Level2');        
        });

    }
}
