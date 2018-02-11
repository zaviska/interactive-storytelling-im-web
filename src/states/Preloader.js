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
    this.load.audio('intro', 'audio/intro/haunted-forest_terrasound_de.mp3');
    this.load.video('ball', 'video/ball_glow.mp4');
    this.load.video('intro_title', 'video/blackAirKnights_title.mp4');
    this.load.video('intro_title_sound', 'video/blackAirKnights_title_audio.mp4');
    this.load.image('button_play', 'image/button/button_play.png');
    this.load.spritesheet('button', 'image/button/button_sprite_sheet.png', 193, 71);
  }

  create() {
    //  Here is a good place to initialize plugins dependent of any game asset.
    //  Don't forget to `import` them first. Example:
    // this.game.myPlugin = this.plugins.add(MyPlugin/*, ... parameters ... */);

    this.state.start('Intro');
  }

  // --------------------------------------------------------------------------

  showSplashScreen() {
    this.add.image(0, 0, 'splash-screen');
    this.load.setPreloadSprite(this.add.image(82, 282, 'progress-bar'));
  }

}
