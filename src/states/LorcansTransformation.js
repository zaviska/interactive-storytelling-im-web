export default class LorcansTransformation extends Phaser.State {

    preload() {
      this.load.video('cut_scene_lorcans_transformation', 'video/cut_scene/lorcans_transformation.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneLorcansTransformation = this.game.add.video('cut_scene_lorcans_transformation');
  
      this.game.videoImageLorcansTransformation = cutSceneLorcansTransformation.addToWorld(0, 0);
      cutSceneLorcansTransformation.play();
      cutSceneLorcansTransformation.onComplete.add(onClickNextButton); 
      
      this.game.nextLorcansTransformationButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
  
      function onClickNextButton() {
        cutSceneLorcansTransformation.destroy();
        that.game.nextLorcansTransformationButton.destroy();
        that.state.start('ShipShadowEmpireFinalFight');
        that.game.showNavigation();
      }
    }
    resize (x, y) {
      console.log("SCALE MODE CREATE LORCANS TRANSFORMATION", x, y);
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageLorcansTransformation.scale.set(videoScale);
  
      this.game.nextLorcansTransformationButton.x = scaleModiferX*1710;
          this.game.nextLorcansTransformationButton.y = scaleModiferY*10;
    }
  }