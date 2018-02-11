
export default class Game extends Phaser.State {

  create() {
   
    let introTitleSound = this.game.add.video('intro_title_sound');
    introTitleSound.play(true);
    introTitleSound.addToWorld(-40, -70);
    
    let nextButton = this.game.add.button(500, 500, 'button', onClickNExtButton, this, 2, 1, 0);

   
    function onClickNExtButton() {
        introTitleSound.destroy();
        nextButton.destroy();
        this.state.start('Game');
    }

  }

}