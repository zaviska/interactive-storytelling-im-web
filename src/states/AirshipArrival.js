export default class AirshipArrival extends Phaser.State {

  preload() {
    this.load.video('cut_scene_airship_arrival', 'video/cut_scene/airship_arrival.mp4');
  }

  create() {
    let that = this;

    this.game.hideNavigation();

    let cutSceneAirshipArrival = this.game.add.video('cut_scene_airship_arrival');
    
    let videoImage = cutSceneAirshipArrival.addToWorld(0, 0);
    cutSceneAirshipArrival.play();
    cutSceneAirshipArrival.onComplete.add(onClickNextButton); 
  
    
    let nextButton = this.game.add.button(1200, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);


    function onClickNextButton() {
      cutSceneAirshipArrival.destroy();
      nextButton.destroy();
      that.state.start('FarmAfterVisit');
      that.game.showNavigation();
    }

  }

}