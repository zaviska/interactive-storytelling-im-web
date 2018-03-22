export default class AirshipDeparture extends Phaser.State {

  preload() {
    this.load.video('cut_scene_airship_departure', 'video/cut_scene/airship_departure.mp4');
  }

  create() {
    let that = this;

    this.game.hideNavigation();

    let cutSceneAirshipDeparture = this.game.add.video('cut_scene_airship_departure');
    
    let videoImage = cutSceneAirshipDeparture.addToWorld(0, 0);
    cutSceneAirshipDeparture.play();
    cutSceneAirshipDeparture.onComplete.add(onClickNextButton); 
  
    
    let nextButton = this.game.add.button(1200, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);


    function onClickNextButton() {
      cutSceneAirshipDeparture.destroy();
      nextButton.destroy();
      that.state.start('Ship');
      that.game.showNavigation();
    }

  }

}