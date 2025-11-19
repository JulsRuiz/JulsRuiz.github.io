import Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        document.querySelectorAll(".game-ui").forEach(el => el.remove());

        this.add.text(750, 200, 'Interactive AVL Tree', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const problems = [
            { label: 'Puzzle 1',  scene: 'Prob01', color: '#aaff00ff' },
            { label: 'Puzzle 2',  scene: 'Prob02', color: '#ffcc00' },
            { label: 'Puzzle 3',  scene: 'Prob03', color: '#ff9900' },
            { label: 'Puzzle 4',  scene: 'Prob04', color: '#ff6666' },
            { label: 'Puzzle 5',  scene: 'Prob05', color: '#ff33cc' },
            { label: 'Puzzle 6',  scene: 'Prob06', color: '#cc33ff' },
            { label: 'Puzzle 7',  scene: 'Prob07', color: '#6633ff' },
            { label: 'Puzzle 8',  scene: 'Prob08', color: '#3399ff' },
            { label: 'Puzzle 9',  scene: 'Prob09', color: '#33ffcc' },
            { label: 'Puzzle 10', scene: 'Prob10', color: '#57c071ff', font: 26 },
            { label: 'Puzzle 11', scene: 'Prob11', color: '#70218dff', font: 26 },
            { label: 'Puzzle 12', scene: 'Prob12', color: '#8b2424ff', font: 26 }
        ];

        // Layout rules
        const cols = 4;
        const startX = 300;
        const startY = 350;
        const xSpacing = 300;
        const ySpacing = 100;

        problems.forEach((p, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const x = startX + (col * xSpacing);
            const y = startY + (row * ySpacing);

            const gameScene = this.scene.get(p.scene);
            const isCompleted = gameScene?.isCompleted === true;

            let normalColor;
            let hoverColor;

            if (isCompleted) {
                normalColor = '#888888';
                hoverColor  = '#88888899';
            }
            else {
                normalColor = p.color;
                hoverColor  = p.color.slice(0, 7) + '99';
            }

            const text = this.add.text(x, y, p.label, {
                fontSize: `${p.font || 28}px`,
                backgroundColor: normalColor,
                padding: { x: 20, y: 10 },
                color: '#000'
            }).setOrigin(0.5).setInteractive();
            
            text.on('pointerover', () => {
                text.setBackgroundColor(hoverColor);
            });

            text.on('pointerout', () => {
                text.setBackgroundColor(normalColor);
            });

            text.on('pointerdown', () => {
                if (isCompleted) return;
                this.scene.start(p.scene);
            });
        });
    }
}
