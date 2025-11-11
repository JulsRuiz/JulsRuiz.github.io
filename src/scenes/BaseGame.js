export default class BaseGame extends Phaser.Scene {
    constructor(key) {
        super(key);      // scene key is dynamic
    }

    buildTreeFromInput(values) {
            // Clear existing nodes & links visually
            for (const node of this.nodes) node.destroy();
            this.nodes = [];
            this.links = [];
    
            // Helper to insert node into BST
            const insertNode = (root, newNode) => {
                if (newNode.value < root.value) {
                    if (!root.leftChild) {
                        root.addChild(newNode, 'left');
                        this.links.push({ node1: root, node2: newNode, direction: 'left' });
                    } else {
                        insertNode(root.leftChild, newNode);
                    }
                } else {
                    if (!root.rightChild) {
                        root.addChild(newNode, 'right');
                        this.links.push({ node1: root, node2: newNode, direction: 'right' });
                    } else {
                        insertNode(root.rightChild, newNode);
                    }
                }
            };
    
            // Create root and insert all others
            if (values.length === 0) return;
            const rootValue = Number(values[0]);
            const root = new Node(this, 0, 0, 20, 0xffffff, rootValue);
            this.nodes.push(root);
            this.input.setDraggable(root);
    
            for (let i = 1; i < values.length; i++) {
                const val = Number(values[i]);
                const newNode = new Node(this, 0, 0, 20, 0xffffff, val);
                this.nodes.push(newNode);
                this.input.setDraggable(newNode);
                insertNode(root, newNode);
            }
    
            this.layoutTree(root);
            this.validateTree(root);
    }

    layoutTree(root, startX = 750, startY = 50, xSpacing = 300, ySpacing = 75) {
        if (!root) return;

        const visited = new Set();

        // Recursive helper to layout the connected tree
        const placeTree = (node, x, y, xSpace, ySpace) => {
            if (!node || visited.has(node)) return;

            visited.add(node);

            node.x = x;
            node.y = y;
            node.body.updateFromGameObject();
            node.updateLabel();

            if (node.leftChild) {
                placeTree(node.leftChild, x - xSpace, y + ySpace, xSpace / 2, ySpace);
            }
            if (node.rightChild) {
                placeTree(node.rightChild, x + xSpace, y + ySpace, xSpace / 2, ySpace);
            }
        };

        // Lay out all nodes connected to the root
        placeTree(root, startX, startY, xSpacing, ySpacing);

        // ---- Handle orphan nodes ----
        const sceneWidth = 1500;
        const sceneHeight = 700;

        // Bottom area reserved for orphans (avoid button at ~x = 100)
        const orphanY = sceneHeight - 50;   // place them 50px from bottom
        const orphanStartX = 250;           // skip area where button is
        const orphanSpacingX = 75;         // horizontal spacing between orphans
        let count = 0;

        for (const node of this.nodes) {
            if (!visited.has(node)) {
                // ---- Remove all links/relations ----
                if (node.parent) {
                    if (node.parent.leftChild === node) node.parent.leftChild = null;
                    if (node.parent.rightChild === node) node.parent.rightChild = null;
                    node.parent = null;
                }
                node.leftChild = null;
                node.rightChild = null;
                node.invalid = false;

                // Remove bidirectional link records
                node.removeAllLinks();

                // ---- Position orphan node ----
                const ox = orphanStartX + (count * orphanSpacingX);
                const oy = orphanY;

                node.x = ox;
                node.y = oy;
                node.body.updateFromGameObject();
                node.updateLabel();
                node.setFillStyle(0xffffff);

                count++;
            }
        }

        // ---- Clean up scene-level link data ----
        this.links = this.links.filter(link => visited.has(link.node1) && visited.has(link.node2));
    }

    validateTree(root) {
        // Step 1 — clear all invalid flags
        for (const node of this.nodes) {
            node.invalid = false;
            node.setFillStyle(0xffffff);
        }

        // Step 2 — recursive helper
        const checkNode = (node) => {
            if (!node) return 0;

            // skip orphans (disconnected nodes)
            if (!node.parent && node !== root) return 0;

            let leftDepth = checkNode(node.leftChild);
            let rightDepth = checkNode(node.rightChild);

            // Step 3 — check binary order
            if (node.leftChild && node.leftChild.value > node.value) {
                node.invalid = true;
                node.leftChild.invalid = true;
            }

            if (node.rightChild && node.rightChild.value < node.value) {
                node.invalid = true;
                node.rightChild.invalid = true;
            }

            // Step 4 — check balance
            const balanced = Math.abs(leftDepth - rightDepth) <= 1;
            if (!balanced) {
                node.invalid = true;
            }

            return Math.max(leftDepth, rightDepth) + 1;
        };

        // Step 5 — run the check
        checkNode(root);

        // Step 6 — visually mark invalid nodes
        for (const node of this.nodes) {
            if (node.invalid) {
                node.setFillStyle(0xFF9696); // red for invalid
            }
        }
    }

    init() {
        this.nodes = [];
        this.links = [];

        this.linkGraphics = this.add.graphics();
    }

    preload() {
        this.load.text('treeData', '/assets/data.txt');
    }

    create() {
        this.input.dragDistanceThreshold = 10;

        this.input.on('gameobjectup', (pointer, gameObject) => {
            if (pointer.button !== 0) return;

            let aDrag = false;
            // Ignore if there was a drag
            this.nodes.forEach(node => {
                if (node.wasDragged) {
                    aDrag = true;
                    node.wasDragged = false;
                    return;
                }
            });
            
            if (aDrag) {
                aDrag = false;
                return;
            }
            if (gameObject.selected) {
                gameObject.selected = false;
                gameObject.setFillStyle((gameObject.invalid) ? 0xFF9696 : 0xffffff);
            }
            else if (!gameObject.selected) {
                gameObject.selected = true;
                gameObject.setFillStyle(0xAAFF00);
            }

            // Deselect other nodes
            if (gameObject.selected) {
                this.nodes.forEach(node => {
                    if (node !== gameObject) {
                        node.selected = false;
                        node.setFillStyle((node.invalid) ? 0xFF9696 : 0xffffff);
                    }
                });
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.activePopup) {
                // Get popup bounds (assuming it's a Phaser GameObject)
                const bounds = this.activePopup.getBounds();

                // Check if pointer is inside popup area
                const inside =
                    pointer.x >= bounds.x &&
                    pointer.x <= bounds.x + bounds.width &&
                    pointer.y >= bounds.y &&
                    pointer.y <= bounds.y + bounds.height;

                // Only destroy if clicked OUTSIDE the popup
                if (!inside) {
                    this.activePopup.destroy();
                    this.activePopup = null;
                }
            }
        });

        this.input.on('pointerup', (pointer) => {
            // Deselect all nodes if clicked on empty space
            if (pointer.button !== 0) return;

            const clickedOnNode = this.nodes.some(node => node.getBounds().contains(pointer.x, pointer.y));
            if (!clickedOnNode) {
                this.nodes.forEach(node => {
                    if (node.selected) {
                        node.selected = false;
                        node.setFillStyle((node.invalid) ? 0xFF9696 : 0xffffff);
                    }
                });
            }
        });

        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.wasDragged = true;
            gameObject.startX = gameObject.x;
            gameObject.startY = gameObject.y;

            gameObject.setFillStyle(0xD59DF5);
        });

        
        this.input.on('drag', (pointer, gameObject) => {
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
            gameObject.body.updateFromGameObject();
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setFillStyle((gameObject.invalid) ? 0xFF9696 : 0xffffff);
            
            // Check for overlaps with other nodes
            for (const other of this.nodes) {
                if (other === gameObject) continue;

                // Check if node overlaps another node
                if (Phaser.Geom.Intersects.CircleToCircle(gameObject, other)) {
                    const parent = other;
                    const child = gameObject;

                    //if child already has a parent, cancel
                    if (child.parent && child.parent !== parent) {
                        // but allow it if the parent was cleared before
                        if (child.parent.leftChild !== child && child.parent.rightChild !== child) {
                            child.parent = null; // fix stale parent reference
                        } else {
                            gameObject.x = gameObject.startX;
                            gameObject.y = gameObject.startY;
                            gameObject.body.updateFromGameObject();
                            break;
                        }
                    }

                    // Check if they are already linked
                    if (!parent.isLinkedTo(child)) {
                        //child direction popup
                        if (this.activePopup) return;

                        this.activePopup = new Popup(
                            this,
                            (parent.x + child.x) / 2,
                            (parent.y + child.y) / 2,
                            'Left or Right Child?',
                            () => {  // Left Child callback
                                const existingChild = parent.leftChild;
                                const side = 'left';

                                // if already has a left child, remove that link first
                                if (existingChild) {
                                    // unlink visually and logically
                                    this.links = this.links.filter(link =>
                                        !((link.node1 === parent && link.node2 === existingChild && link.direction === side) ||
                                        (link.node1 === existingChild && link.node2 === parent && link.direction === side))
                                    );

                                    parent.removeChild(side);
                                }

                                // now add the new left child link
                                parent.addChild(child, side);

                                // update the scene's link list
                                this.links.push({ node1: parent, node2: child, direction: side });
                                
                                this.activePopup = null;
                            },
                            () => {  // Right Child callback
                                const existingChild = parent.rightChild;
                                const side = 'right';
                                // if already has a Right child, remove that link first
                                if (existingChild) {
                                    // unlink visually and logically
                                    this.links = this.links.filter(link =>
                                        !((link.node1 === parent && link.node2 === existingChild && link.direction === side) ||
                                        (link.node1 === existingChild && link.node2 === parent && link.direction === side))
                                    );

                                    parent.removeChild(side);
                                }

                                // now add the new Right child link
                                parent.addChild(child, side);

                                // update the scene's link list
                                this.links.push({ node1: parent, node2: child, direction: side });
                                
                                this.activePopup = null;
                            }
                        );
                    }
                    else if (other.parent !== gameObject) {
                        const side = parent.whichChild(child);

                        this.links = this.links.filter(link =>
                            !((link.node1 === parent && link.node2 === child && link.direction === side) ||
                            (link.node1 === child && link.node2 === parent && link.direction === side))
                        );

                        //remove child reference
                        parent.removeChild(side);
                    }

                    gameObject.x = gameObject.startX;
                    gameObject.y = gameObject.startY;
                    gameObject.body.updateFromGameObject();
                }
            }
        });

        const playButton = this.add.text(100, 650, 'Layout', {
            fontSize: '32px',
            color: '#000000ff',
            backgroundColor: '#AAFF00',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true }); // changes cursor to a hand

        // Hover & click events
        playButton.on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#aaff00ba' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ backgroundColor: '#AAFF00' });
        });

        playButton.on('pointerdown', () => {
            //layout tree from selected node
            this.nodes.forEach(node => {
                if (node.selected) {
                    this.layoutTree(node);
                    this.validateTree(node);
                    return;
                }
            });

            //deselect all nodes after layout
            this.nodes.forEach(node => {
                if (node.selected) {
                    node.selected = false;
                    node.setFillStyle((node.invalid) ? 0xFF9696 : 0xffffff);
                }
            });
        });
    }

    update() {
        for (const node of this.nodes) {
            node.updateLabel();
        }

        this.linkGraphics.clear();

        for (const link of this.links) {
            const color = link.direction === 'left' ? 0x003cff : 0xffb30f;

            this.linkGraphics.lineStyle(2, color, 1);
            this.linkGraphics.beginPath();
            this.linkGraphics.moveTo(link.node1.x, link.node1.y);
            this.linkGraphics.lineTo(link.node2.x, link.node2.y);
            this.linkGraphics.strokePath();

            // ---- Draw the triangle arrowhead at the middle of the link ----
            const midX = (link.node1.x + link.node2.x) / 2;
            const midY = (link.node1.y + link.node2.y) / 2;

            const dx = link.node2.x - link.node1.x;
            const dy = link.node2.y - link.node1.y;
            const angle = Math.atan2(dy, dx);

            // Set triangle size
            const arrowLength = 20;  // length of the triangle (point)
            const arrowWidth = 16;    // width of the base

            // Triangle points (tip points toward child)
            const tipX = midX + Math.cos(angle) * (arrowLength / 2);
            const tipY = midY + Math.sin(angle) * (arrowLength / 2);
            const leftX = midX + Math.cos(angle + Math.PI * 0.75) * (arrowWidth / 2);
            const leftY = midY + Math.sin(angle + Math.PI * 0.75) * (arrowWidth / 2);
            const rightX = midX + Math.cos(angle - Math.PI * 0.75) * (arrowWidth / 2);
            const rightY = midY + Math.sin(angle - Math.PI * 0.75) * (arrowWidth / 2);

            // Fill the triangle (based on direction color)
            this.linkGraphics.fillStyle(color, 1);
            this.linkGraphics.beginPath();
            this.linkGraphics.moveTo(tipX, tipY);
            this.linkGraphics.lineTo(leftX, leftY);
            this.linkGraphics.lineTo(rightX, rightY);
            this.linkGraphics.closePath();
            this.linkGraphics.fillPath();

            // Outline the triangle for clarity
            this.linkGraphics.lineStyle(2, 0x000000, 1);
            this.linkGraphics.beginPath();
            this.linkGraphics.moveTo(tipX, tipY);
            this.linkGraphics.lineTo(leftX, leftY);
            this.linkGraphics.lineTo(rightX, rightY);
            this.linkGraphics.closePath();
            this.linkGraphics.strokePath();
        }
    }

}
