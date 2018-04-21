export default class Intro extends Phaser.State {

  preload() {
    this.load.video('intro_title_sound', 'video/intro/blackAirKnights_intro.mp4');
  }

  create() {

    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

    this.game.hideNavigation();

    let introTitleSound = this.game.add.video('intro_title_sound');
    introTitleSound.play(true);
    this.game.videoImage = introTitleSound.addToWorld(0, 0);
    
    this.game.nextButton = this.game.add.button(1710, 10, 'playButton', onClickNextButton, this, 1, 0, 2);

    this.resize(this.game.width, this.game.height);

    function onClickNextButton() {
        introTitleSound.destroy();
        this.game.nextButton.destroy();
        this.state.start('OrdinaryWorld');
    }

  }

  resize (x, y) {
    var scaleModiferX = x/1920;
    var scaleModiferY = y/1080;

    var videoScale = Math.min(scaleModiferX, scaleModiferY);
    this.game.videoImage.scale.set(videoScale);

    this.game.nextButton.x = scaleModiferX*1710;
    this.game.nextButton.y = scaleModiferY*10;
    this.game.nextButton.scale.set(videoScale);
  } 

}