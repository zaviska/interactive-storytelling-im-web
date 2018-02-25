
export default class Game extends Phaser.State {

  create() {

    //ANIMATION: intro "Black Air Knights" (with audio)
    let introTitleSound = this.game.add.video('intro_title_sound');
    introTitleSound.play(true);
    introTitleSound.addToWorld(0, 0);
    
    let nextButton = this.game.add.button(1050, 620, 'nextButton', onClickNextButton, this, 1, 0, 2);

    // --------------------------------------------------------------------------

    function onClickNextButton() {
        introTitleSound.destroy();
        nextButton.destroy();
        this.state.start('Farm');
    }

  }

}