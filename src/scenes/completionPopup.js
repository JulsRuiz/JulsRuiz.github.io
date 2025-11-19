import Phaser from 'phaser';

export default class completionPopup extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text1, text2, onConfirm, onCancel) {
        super(scene, x, y);

        const bg = scene.add.rectangle(0, 0, 600, 300, 0x000000, 0.8)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xffffff);

        const label1 = scene.add.text(0, -100, text1, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const label2 = scene.add.text(0, -10, text2, {
            fontSize: '32px',
            color: '#ffffff',
            wordWrap: { width: 575 },
            align: 'center'
        }).setOrigin(0.5);

        const leaveBtn = scene.add.text(10, 100, 'Home', {
            fontSize: '32px',
            color: '#000000ff',
            backgroundColor: '#AAFF00',
            padding: { x: 100, y: 10 }
        }).setOrigin(0.5).setInteractive();

        leaveBtn.on('pointerover', () => {
            leaveBtn.setStyle({ backgroundColor: '#aaff00ba' });
        });

        leaveBtn.on('pointerout', () => {
            leaveBtn.setStyle({ backgroundColor: '#AAFF00' });
        });

        leaveBtn.on('pointerdown', () => {
            this.destroy();
            onCancel && onCancel();
        });

        this.add([bg, label1, label2, leaveBtn]);
        this.setDepth(12); // Ensure it renders above everything

        scene.add.existing(this);
    }
}