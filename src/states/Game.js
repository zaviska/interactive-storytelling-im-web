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
    const {centerX: x, centerY: y} = this.world;


    /*
    let logo = new Logo(this.game, x, y);
    this.add.existing(logo);
    */

    //var helloWorldSprechblase = new Sprechblase(this.game, 550, 150, 'Black Air Knights');

    //SOUND: intro background music (loop)
    let introSound = this.game.add.audio('intro_sound');
    introSound.loopFull();


    
    /* BUTTON: create play button with image
    let button_play = this.game.add.image(100, 100, 'button_play');
    button_play.width = 50;
    button_play.height = 50;
    */

    //BUTTON
    let nextButton = this.game.add.button(1050, 620, 'playButton', onClickPlayButton, this, 1, 0, 2);
    let backButton = this.game.add.button(860, 620, 'backButton', onClickBackButton, this, 1, 0, 2);

    function onClickPauseIntroAudioButton() {
      introSound.pause();
    }

    // --------------------------------------------------------------------------

    function onClickBackButton() {
      introSound.destroy();
      backButton.destroy();
      this.state.start('Intro');
    }

    function onClickPlayButton() {
      introSound.pause();
    }

  }

}