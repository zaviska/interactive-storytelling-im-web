export default class AirshipDeparture extends Phaser.State {

  preload() {
    this.load.video('cut_scene_airship_departure', 'video/cut_scene/airship_departure.mp4');
  }

  create() {
    let that = this;
    this.game.hideNavigation();

    //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

    let cutSceneAirshipDeparture = this.game.add.video('cut_scene_airship_departure');

    this.game.videoImageAirshipDeparture = cutSceneAirshipDeparture.addToWorld(0, 0);
    cutSceneAirshipDeparture.play();
    cutSceneAirshipDeparture.onComplete.add(onClickNextButton); 
    
    this.game.nextAirshipDepartureButton = this.game.add.button(1730, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);

    this.resize(this.game.width, this.game.height);

    function onClickNextButton() {
      cutSceneAirshipDeparture.destroy();
      that.game.nextAirshipDepartureButton.destroy();
      that.state.start('Ship');
      that.game.showNavigation();
    }
  }
  resize (x, y) {
    console.log("SCALE MODE CREATE AIRSHIP DEPARTURE", x, y);
    var scaleModiferX = x/1920;
    var scaleModiferY = y/1080;

    var videoScale = Math.min(scaleModiferX, scaleModiferY);
    this.game.videoImageAirshipDeparture.scale.set(videoScale);

    this.game.nextAirshipDepartureButton.x = scaleModiferX*1730;
		this.game.nextAirshipDepartureButton.y = scaleModiferY*10;
  }
}