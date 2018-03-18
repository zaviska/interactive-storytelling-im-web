/*
 * `app` module
 * ============
 *
 * Provides the game initialization routine.
 */

//  Required: import Babel polyfills.
import 'babel-polyfill';

//  Import configuration and game states.
import * as config from './config';
import * as states from './states';
import { TextBoxController } from './textbox/TextBoxController';

//  Add all required states and boot the game.
export function init() {
  const game = new Phaser.Game(config);



  Object
    .entries(states)
    .forEach(([key, state]) => game.state.add(key, state));

  game.state.start('Boot');
  game.textBox = new TextBoxController();

  game.hideNavigation = function () {
      document.getElementById('textbox').style.display = "none";
  }
  game.showNavigation = function() {
    document.getElementById('textbox').style.display = "block";
  }

  return game;
}

export function enterFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

export function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}