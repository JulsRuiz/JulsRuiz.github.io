import BaseGame from "./BaseGame.js";

export default class Tutorial extends BaseGame {
    constructor() {
        super("Tutorial");
    }

    create() {
        super.create();
        
        this.buildTreeFromInput([1, 2]);

        for (const node of this.nodes) {
            node.x = 600;
            node.y = 200 + node.value * 100;
            node.label.setPosition(node.x, node.y);
        }
    }
}