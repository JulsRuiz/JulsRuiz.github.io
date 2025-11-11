import BaseGame from "./BaseGame.js";

export default class InputTestScene extends BaseGame {
    constructor() {
        super("InputTestScene");
    }

    preload() {
        super.preload();
    }

    loadSceneData() {
        const sceneName = this.scene.key;

        const fileText = this.cache.text.get("treeData");
        console.log("== LOAD SCENE DATA ==");
        console.log("Scene key:", sceneName);
        console.log("Raw fileText:", JSON.stringify(fileText));

        const lines = fileText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // Find the line where the first word matches the scene name
        const match = lines.find(line => line.startsWith(sceneName + " "));

        if (!match) {
            console.warn("No matching line in data.txt for scene:", sceneName);
            return null;
        }

        // Extract the numbers
        const index = match.indexOf(" ");
        const numbers = match
            .substring(index + 1)
            .split(",")
            .map(n => Number(n.trim()));

        return numbers;
    }

    create() {
        super.create();  // sets up tree structure, graphics, arrays
        
        const values = this.loadSceneData();
        console.log("LOADED VALUES:", values);

        if (values) {
            console.log("BUILDING TREE WITH:", values);
            this.buildTreeFromInput(values);
        }

        this.events.once('shutdown', () => {
            if (this.inputElement) {
                this.inputElement.remove();
                this.inputElement = null;
            }
        });
    }
}