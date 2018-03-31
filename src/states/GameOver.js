export default class GameOver extends Phaser.State {

    preload() {
      this.load.audio('intro_title_sound', 'audio/intro/haunted-forest_terrasound_de.mp3');
      this.game.load.image('game_over', 'image/game_over_530x110px.png', 530, 110);
    }
  
    create() {
      this.game.hideNavigation();

      this.gameOver = this.add.image(695, 300, 'game_over');
  
      let introTitleSound = this.game.add.audio('intro_title_sound');
      introTitleSound.loopFull();
      
      let nextButton = this.game.add.button(870, 500, 'backButton', onClickNextButton, this, 1, 0, 2);
  
      function onClickNextButton() {
          introTitleSound.destroy();
          nextButton.destroy();
          this.state.start('Intro');
          this.game.showNavigation();
      }
    }
  
  }