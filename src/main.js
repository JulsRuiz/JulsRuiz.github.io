import Phaser, { Input, Physics } from 'phaser'

import TestScene from './scenes/TestScene.js'
import InputTestScene from './scenes/InputTestScene.js'
import Menu from './scenes/Menu.js';

const config = {
    width: 1500,
    height: 700,
    type: Phaser.AUTO,
    backgroundColor: '#727272',
    scene: [Menu, TestScene, InputTestScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
}

new Phaser.Game(config)
