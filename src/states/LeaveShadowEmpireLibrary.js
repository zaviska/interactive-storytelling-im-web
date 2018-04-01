export default class LeaveShadowEmpireLibrary extends Phaser.State {

    preload() {
      this.load.video('cut_scene_leave_shadow_empire_library', 'video/cut_scene/leave_shadow_empire_library.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneLeaveShadowEmpireLibrary = this.game.add.video('cut_scene_leave_shadow_empire_library');
  
      this.game.videoImageLeaveShadowEmpireLibrary = cutSceneLeaveShadowEmpireLibrary.addToWorld(0, 0);
      cutSceneLeaveShadowEmpireLibrary.play();
      cutSceneLeaveShadowEmpireLibrary.onComplete.add(onClickNextButton); 
      
      this.game.nextLeaveShadowEmpireLibraryButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
  
      function onClickNextButton() {
        cutSceneLeaveShadowEmpireLibrary.destroy();
        that.game.nextLeaveShadowEmpireLibraryButton.destroy();
        that.state.start('ShipTestLibraryBack');
        that.game.showNavigation();
      }
    }
    resize (x, y) {
      console.log("SCALE MODE CREATE LEAVE SHADOW EMPIRE LIBRARY", x, y);
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageLeaveShadowEmpireLibrary.scale.set(videoScale);
  
      this.game.nextLeaveShadowEmpireLibraryButton.x = scaleModiferX*1710;
      this.game.nextLeaveShadowEmpireLibraryButton.y = scaleModiferY*10;
      this.game.nextLeaveShadowEmpireLibraryButton.scale.set(videoScale);
    }
  }