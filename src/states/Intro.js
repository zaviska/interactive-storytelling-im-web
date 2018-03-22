export default class Intro extends Phaser.State {

  preload() {
    this.load.video('intro_title_sound', 'video/intro/blackAirKnights_intro.mp4');
  }

  create() {

    this.game.hideNavigation();

    let introTitleSound = this.game.add.video('intro_title_sound');
    introTitleSound.play(true);
    introTitleSound.addToWorld(0, 0);
    
    let nextButton = this.game.add.button(1200, 10, 'playButton', onClickNextButton, this, 1, 0, 2);

    function onClickNextButton() {
        introTitleSound.destroy();
        nextButton.destroy();
        this.state.start('OrdinaryWorld');
    }

  }

}