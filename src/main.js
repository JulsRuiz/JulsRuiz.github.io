import Phaser, { Input, Physics } from 'phaser'

import TestScene from './scenes/TestScene.js'
import InputTestScene from './scenes/InputTestScene.js'
import Prob01 from './scenes/Problems/Prob01.js'
import Prob02 from './scenes/Problems/Prob02.js'
import Prob03 from './scenes/Problems/Prob03.js'
import Prob04 from './scenes/Problems/Prob04.js'
import Prob05 from './scenes/Problems/Prob05.js'
import Prob06 from './scenes/Problems/Prob06.js'
import Prob07 from './scenes/Problems/Prob07.js'
import Prob08 from './scenes/Problems/Prob08.js'
import Prob09 from './scenes/Problems/Prob09.js'
import Prob10 from './scenes/Problems/Prob10.js'
import Prob11 from './scenes/Problems/Prob11.js'
import Prob12 from './scenes/Problems/Prob12.js'
import Menu from './scenes/Menu.js';

const config = {
    width: 1500,
    height: 700,
    type: Phaser.AUTO,
    backgroundColor: '#727272',
    scene: [Menu, TestScene, InputTestScene, Prob01, Prob02, Prob03, Prob04, Prob05, Prob06, Prob07, Prob08, Prob09, Prob10, Prob11, Prob12],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
}

new Phaser.Game(config)
