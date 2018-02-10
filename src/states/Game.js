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

    /*
    let logo = new Logo(this.game, x, y);
    this.add.existing(logo);
    */

    //var helloWorldSprechblase = new Sprechblase(this.game, 550, 150, 'Black Air Knights');

    //SOUND: intro background music (loop)
    let music = this.game.add.audio('intro');
    music.loopFull();
    
    
    /* ANIMATION: glowing ball
    let glowingBall = this.game.add.video('ball');
    glowingBall.play(true);
    glowingBall.addToWorld(300, 200);
    //let ball = require('../assets/animation_adobeAnimateCC/ball_gow.js');
    */

    /* ANIMATION: smoking title "Black Air Knights" (without audio)
    let introTitle = this.game.add.video('intro_title');
    introTitle.play(true);
    introTitle.addToWorld(-40, -70);
    */

    /* ANIMATION: smoking title "Black Air Knights" (with audio)
    let introTitleSound = this.game.add.video('intro_title_sound');
    introTitleSound.play(true);
    introTitleSound.addToWorld(-40, -70);
    */
    
    /* BUTTON: create play button with image
    let button_play = this.game.add.image(100, 100, 'button_play');
    button_play.width = 50;
    button_play.height = 50;
    */

    //BUTTON: create button with sprite (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
    let button = this.game.add.button(500, 500, 'button', pauseIntroAudioOnClick, this, 2, 1, 0);

    button.onInputOver.add(over, this); 
    button.onInputOut.add(out, this);   
    button.onInputUp.add(up, this);     

    //BUTTON FUNCTIONS
    function up() {
      console.log('button up');
    }

    function over() {
      console.log('button over');
    }

    function out() {
      console.log('button out');
    }

    function playIntroVideoOnClick() {
      //ANIMATION: smoking title "Black Air Knights" (with audio)
      let introTitleSound = this.game.add.video('intro_title_sound');
      introTitleSound.play(true);
      introTitleSound.addToWorld(-40, -70);
    }

    function pauseIntroAudioOnClick() {
      music.pause();
    }

  }

}