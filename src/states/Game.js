/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Logo from '../objects/Logo';
import Sprechblase from '../objects/Sprechblase';

export default class Game extends Phaser.State {

  create() {
    //  TODO: Replace this content with really cool game code here :)
    const {centerX: x, centerY: y} = this.world;
    let logo = new Logo(this.game, x, y);
    this.add.existing(logo);

    var helloWorldSprechblase = new Sprechblase(this.game, x, y, 'Hello World');



  }

}
