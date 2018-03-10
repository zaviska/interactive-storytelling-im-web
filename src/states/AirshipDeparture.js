export default class AirshipDeparture extends Phaser.State {

    preload() {
        this.load.video('cut_scene_airship_departure', 'video/cut_scene/airship_departure.mp4');
    }

    create() {
  
      let cutSceneAirshipArrival = this.game.add.video('cut_scene_airship_departure');
      cutSceneAirshipArrival.play(true);
      cutSceneAirshipArrival.addToWorld(0, 0);
      
      let nextButton = this.game.add.button(1700, 1000, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      function onClickNextButton() {
        cutSceneAirshipArrival.destroy();
        nextButton.destroy();
        this.state.start('Ship');
      }
  
    }
  
  }