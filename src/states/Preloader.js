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
    //this.load.audio('intro_sound', 'audio/intro/haunted-forest_terrasound_de.mp3');
    this.load.video('intro_title_sound', 'video/intro/blackAirKnights_intro.mp4');
    this.load.spritesheet('nextButton', 'image/button/nextButton.png', 180, 35);
    this.load.spritesheet('backButton', 'image/button/backButton.png', 180, 35);
    this.load.spritesheet('playButton', 'image/button/playButton.png', 180, 35);
  }

  create() {
    //  Here is a good place to initialize plugins dependent of any game asset.
    //  Don't forget to `import` them first. Example:
    // this.game.myPlugin = this.plugins.add(MyPlugin/*, ... parameters ... */);

    this.state.start('Ship');
  }

  // --------------------------------------------------------------------------

  showSplashScreen() {
    this.add.image(800, 400, 'loading');
    //this.load.setPreloadSprite(this.add.image(82, 282, 'progress-bar'));
  }

}
