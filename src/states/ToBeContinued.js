export default class ToBeContinued extends Phaser.State {

    preload() {
      this.load.audio('intro_title_sound', 'audio/intro/haunted-forest_terrasound_de.mp3');
      this.game.load.image('to_be_continued', 'image/to_be_continued_410x100px.png', 410, 100);
    }
  
    create() {
      this.game.hideNavigation();

      this.toBeContinued = this.add.image(500, 300, 'to_be_continued');
      this.toBeContinued.scale.set(0.5);
  
      let introTitleSound = this.game.add.audio('intro_title_sound');
      introTitleSound.loopFull();
      
      let nextButton = this.game.add.button(1200, 10, 'playButton', onClickNextButton, this, 1, 0, 2);
  
      function onClickNextButton() {
          introTitleSound.destroy();
          nextButton.destroy();
          if(this.game.mage === true) {
            this.state.start('ShipTestLibrary');
          } else {
            this.state.start('ShipTraining');
          }
          this.game.showNavigation();
      }
    }
  
  }