export default class AirshipArrival extends Phaser.State {

  preload() {
    this.load.video('cut_scene_airship_arrival', 'video/cut_scene/airship_arrival.mp4');
  }

  create() {
    let that = this;
    this.game.hideNavigation();

    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

    let cutSceneAirshipArrival = this.game.add.video('cut_scene_airship_arrival');

    this.game.videoImageAirshipArrival = cutSceneAirshipArrival.addToWorld(0, 0);
    cutSceneAirshipArrival.play();
    cutSceneAirshipArrival.onComplete.add(onClickNextButton);

    this.game.nextAirshipArrivalButton = this.game.add.button(1730, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);

    this.resize(this.game.width, this.game.height);
    
    function onClickNextButton() {
      cutSceneAirshipArrival.destroy();
      that.game.nextAirshipArrivalButton.destroy();
      that.state.start('FarmAfterVisit');
      that.game.showNavigation();
    }
  }

  resize (x, y) {
    console.log("SCALE MODE CREATE AIRSHIP ARRIVAL", x, y);
    var scaleModiferX = x/1920;
    var scaleModiferY = y/1080;

    var videoScale = Math.min(scaleModiferX, scaleModiferY);
    this.game.videoImageAirshipArrival.scale.set(videoScale);

    this.game.nextAirshipArrivalButton.x = scaleModiferX*1730;
		this.game.nextOrdinareWorldButton.y = scaleModiferY*10;
  } 
}