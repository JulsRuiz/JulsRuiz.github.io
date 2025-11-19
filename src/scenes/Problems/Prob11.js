import BaseGame from "../BaseGame.js";
import sceneData from "../../assets/data.json"; // import your JSON

export default class Prob11 extends BaseGame {
    constructor() {
        super("Prob11");
    }

    create() {
        super.create();
        
        const values = sceneData[this.scene.key]; 

        if (values) {
            console.log("Loaded values:", values);
            this.startingValues = [...values];
            this.buildTreeFromInput(values);
        } else {
            console.warn("No data found for scene:", this.scene.key);
        }

        this.events.once('shutdown', () => {
            if (this.inputElement) {
                this.inputElement.remove();
                this.inputElement = null;
            }
        });
    }
}