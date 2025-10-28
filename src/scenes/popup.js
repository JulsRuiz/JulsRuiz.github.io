import Phaser from 'phaser';

export default class Popup extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, onConfirm, onCancel) {
        super(scene, x, y);

        const bg = scene.add.rectangle(0, 0, 200, 100, 0x000000, 0.8)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xffffff);

        const label = scene.add.text(0, -20, text, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'wrap'
        }).setOrigin(0.5);

        const yesBtn = scene.add.text(-40, 25, 'Left', {
            fontSize: '16px',
            backgroundColor: '#003cffff',
            padding: { x: 10, y: 8 }
        }).setOrigin(0.5).setInteractive();

        const noBtn = scene.add.text(40, 25, 'Right', {
            fontSize: '16px',
            backgroundColor: '#ffb30fff',
            padding: { x: 10, y: 8 }
        }).setOrigin(0.5).setInteractive();

        yesBtn.on('pointerdown', () => {
            this.destroy();
            onConfirm && onConfirm();
        });

        noBtn.on('pointerdown', () => {
            this.destroy();
            onCancel && onCancel();
        });

        this.add([bg, label, yesBtn, noBtn]);
        this.setDepth(10); // Ensure it renders above everything

        scene.add.existing(this);
    }
}