export default class AirshipArrival extends Phaser.State {

    preload() {
        this.load.video('cut_scene_airship_arrival', 'video/cut_scene/airship_arrival.mp4');
    }

    create() {
  
      let cutSceneAirshipArrival = this.game.add.video('cut_scene_airship_arrival');
      cutSceneAirshipArrival.play(true);
      cutSceneAirshipArrival.addToWorld(0, 0);
      
      let nextButton = this.game.add.button(1200, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      function onClickNextButton() {
        cutSceneAirshipArrival.destroy();
        nextButton.destroy();
        this.state.start('Room');
      }
  
    }
  
  }