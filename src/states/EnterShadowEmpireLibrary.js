export default class EnterShadowEmpireLibrary extends Phaser.State {

    preload() {
      this.load.video('cut_scene_enter_shadow_empire_library', 'video/cut_scene/enter_shadow_empire_library.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneEnterShadowEmpireLibrary = this.game.add.video('cut_scene_enter_shadow_empire_library');
  
      this.game.videoImageEnterShadowEmpireLibrary = cutSceneEnterShadowEmpireLibrary.addToWorld(0, 0);
      cutSceneEnterShadowEmpireLibrary.play();
      cutSceneEnterShadowEmpireLibrary.onComplete.add(onClickNextButton); 
      
      this.game.nextEnterShadowEmpireLibraryButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
  
      function onClickNextButton() {
        cutSceneEnterShadowEmpireLibrary.destroy();
        that.game.nextEnterShadowEmpireLibraryButton.destroy();
        that.state.start('ShipShadowEmpireLibrary');
        that.game.showNavigation();
      }
    }
    resize (x, y) {
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageEnterShadowEmpireLibrary.scale.set(videoScale);
  
      this.game.nextEnterShadowEmpireLibraryButton.x = scaleModiferX*1710;
      this.game.nextEnterShadowEmpireLibraryButton.y = scaleModiferY*10;
      this.game.nextEnterShadowEmpireLibraryButton.scale.set(videoScale);
    }
  }