/*
 * Preloader state
 * ===============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a busy splash screen.
 */

import {gameAssets} from '../assets';

export default class Preloader extends Phaser.State {

  preload() {
    this.showSplashScreen();
    this.load.pack('gameAssets', null, {gameAssets});
    this.load.spritesheet('nextButton', 'image/button/nextButton.png', 180, 35);
    this.load.spritesheet('backButton', 'image/button/backButton.png', 180, 35);
    this.load.spritesheet('playButton', 'image/button/playButton.png', 180, 35);
  }

  create() {
    this.state.start('Intro');
  }

  showSplashScreen() {
    this.add.image(800, 400, 'loading');
  }

}
