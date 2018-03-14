export default class OrdinaryWorld extends Phaser.State {

    preload() {
        this.load.video('cut_scene_ordinary_world', 'video/cut_scene/ordinary_world.mp4');
    }

    create() {
  
      let cutSceneOrdinaryWorld = this.game.add.video('cut_scene_ordinary_world');
      cutSceneOrdinaryWorld.play(true);
      cutSceneOrdinaryWorld.addToWorld(0, 0);
      
      let nextButton = this.game.add.button(1200, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      function onClickNextButton() {
        cutSceneOrdinaryWorld.destroy();
        nextButton.destroy();
        this.state.start('Farm');
      }
  
    }
  
  }