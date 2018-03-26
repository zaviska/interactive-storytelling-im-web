export default class Intro extends Phaser.State {

  preload() {
    this.load.video('intro_title_sound', 'video/intro/blackAirKnights_intro.mp4');
  }

  create() {

    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    console.log("SCALE MODE CREATE",  this.scale.scaleMode);

    this.game.hideNavigation();

    let introTitleSound = this.game.add.video('intro_title_sound');
    introTitleSound.play(true);
    this.game.videoImage = introTitleSound.addToWorld(100, 0);
    
    this.game.nextButton = this.game.add.button(870, 900, 'playButton', onClickNextButton, this, 1, 0, 2);

    function onClickNextButton() {
        introTitleSound.destroy();
        this.game.nextButton.destroy();
        this.state.start('OrdinaryWorld');
    }

  }

  resize (x, y) {
    var scaleModiferX = x/1920;
    var scaleModiferY = y/1080;

    var videoScale = Math.min(x / 1280, y/ 720);
    this.game.videoImage.scale.set(videoScale);

    this.game.nextButton.x = scaleModiferX*870;
		this.game.nextButton.y = scaleModiferY*900;
  } 

}