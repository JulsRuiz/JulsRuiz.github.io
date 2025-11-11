import BaseGame from "./BaseGame.js";
import Node from "./node.js";

export default class TestScene extends BaseGame {
    constructor() {
        super("TestScene");
    }

    create() {
        super.create();  // sets up tree structure, graphics, arrays

        // Create input element
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.placeholder = 'Enter values (1,2,3...)';
        this.inputElement.style.position = 'absolute';
        this.inputElement.style.top = '600px';
        this.inputElement.style.left = '40px';
        this.inputElement.style.zIndex = '10';
        this.inputElement.style.fontSize = '18px';
        this.inputElement.classList.add("game-ui");

        document.body.appendChild(this.inputElement);

        // Change scene on Enter key
        this.inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const inputValues = this.inputElement.value
                    .split(',')
                    .map(v => v.trim())
                    .filter(v => v !== '');
                this.inputElement.value = ''; // clear
                this.buildTreeFromInput(inputValues);
            }
        });

        this.events.once('shutdown', () => {
            if (this.inputElement) {
                this.inputElement.remove();
                this.inputElement = null;
            }
        });

        this.setupTree();
    }

    setupTree() {
        for (let i = 1; i <= 31; i++) {
            const newNode = new Node(this, 0, 0, 20, 0xffffff, i);
            this.nodes.push(newNode);
            this.input.setDraggable(newNode);
        }

        for(let i = 1; i < this.nodes.length; i++) {
            const parentIndex = Math.floor((i - 1) / 2);
            const parent = this.nodes[parentIndex];
            const child = this.nodes[i];
            const side = (i % 2 === 1) ? 'left' : 'right';

            parent.addChild(child, side);

            this.links.push({
                node1: parent,
                node2: child,
                direction: side
            });
        }

        this.layoutTree(this.nodes[0]);
        this.validateTree(this.nodes[0]);
    }
}