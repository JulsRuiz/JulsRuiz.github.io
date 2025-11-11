import Phaser from 'phaser';

export default class Node extends Phaser.GameObjects.Arc {
    constructor(scene, x, y, radius = 10, color = 0xffffff, value = null) {
        super(scene, x, y, radius, 0, 360, false, color);
        this.scene = scene;
        this.setInteractive();
        this.links = []; // store connected nodes

        // Enable physics
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        this.scene.add.existing(this);

        //Node properties
        this.parent = null;
        this.rightChild = null;
        this.leftChild = null;
        this.value = value;

        this.label = scene.add.text(x, y, value ?? '', {
            fontSize: '16px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    setParent(Node) {
        this.parent = Node;
    }

    removeParent() {
        this.parent = null;
    }

    addChild(otherNode, side) {
        if (side === 'left') {
            this.leftChild = otherNode;
        } 
        else if (side === 'right') {
            this.rightChild = otherNode;
        }

        otherNode.setParent(this);
        this.linkTo(otherNode);
    }

    removeChild(side) {
        if (side === 'left' && this.leftChild) {
            this.unlinkFrom(this.leftChild);
            this.leftChild.removeParent();
            this.leftChild = null;
        }
        else if (side === 'right' && this.rightChild) {
            this.unlinkFrom(this.rightChild);
            this.rightChild.removeParent();
            this.rightChild = null;
        }
    }

    whichChild(otherNode) {
        if (this.leftChild === otherNode) return 'left';
        if (this.rightChild === otherNode) return 'right';
        return null;
    }

    linkTo(otherNode) {
        if (!this.isLinkedTo(otherNode)) {
            this.links.push(otherNode);
            otherNode.links.push(this); // bidirectional link
        }
    }

    unlinkFrom(otherNode) {
        this.links = this.links.filter(n => n !== otherNode);
        otherNode.links = otherNode.links.filter(n => n !== this);
    }

    isLinkedTo(otherNode) {
        return this.links.includes(otherNode);
    }

    updateLabel() {
        this.label.setPosition(this.x, this.y);
    }

    removeAllLinks() {
        // Remove bidirectional links
        for (const other of this.links) {
            other.links = other.links.filter(n => n !== this);
            if (other.leftChild === this) other.leftChild = null;
            if (other.rightChild === this) other.rightChild = null;
        }
        this.links = [];
        this.parent = null;
        this.leftChild = null;
        this.rightChild = null;
    }

    destroy() {
        // 1. Remove any links to other nodes
        this.removeAllLinks();

        // 2. Destroy the label text if it exists
        if (this.label) {
            this.label.destroy();
            this.label = null;
        }

        // 3. Destroy the node itself (circle)
        super.destroy();
    }

}