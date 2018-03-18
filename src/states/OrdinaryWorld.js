export default class OrdinaryWorld extends Phaser.State {

    preload() {
        this.load.video('cut_scene_ordinary_world', 'video/cut_scene/ordinary_world.mp4');
    }

    create() {
      let that = this;
  
      this.game.hideNavigation();

      let cutSceneOrdinaryWorld = this.game.add.video('cut_scene_ordinary_world');
      
      let videoImage = cutSceneOrdinaryWorld.addToWorld(0, 0);
      cutSceneOrdinaryWorld.play();
      cutSceneOrdinaryWorld.onComplete.add(onClickNextButton); 
    
      
      let nextButton = this.game.add.button(1200, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);


      function onClickNextButton() {
        videoImage.destroy();
        nextButton.destroy();
        that.state.start('Farm');
        that.game.showNavigation();
      }
  
    }
  
  }