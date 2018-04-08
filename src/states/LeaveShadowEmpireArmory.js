export default class LeaveShadowEmpireArmory extends Phaser.State {

    preload() {
      this.load.video('cut_scene_leave_shadow_empire_armory', 'video/cut_scene/leave_shadow_empire_armory_1.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneLeaveShadowEmpireArmory = this.game.add.video('cut_scene_leave_shadow_empire_armory');
  
      this.game.videoImageLeaveShadowEmpireArmory = cutSceneLeaveShadowEmpireArmory.addToWorld(0, 0);
      cutSceneLeaveShadowEmpireArmory.play();
      cutSceneLeaveShadowEmpireArmory.onComplete.add(onClickNextButton); 
      
      this.game.nextLeaveShadowEmpireArmoryButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
  
      function onClickNextButton() {
        cutSceneLeaveShadowEmpireArmory.destroy();
        that.game.nextLeaveShadowEmpireArmoryButton.destroy();
        that.state.start('ShipTestArmoryBack');
        that.game.showNavigation();
      }
    }
    resize (x, y) {
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageLeaveShadowEmpireArmory.scale.set(videoScale);
  
      this.game.nextLeaveShadowEmpireArmoryButton.x = scaleModiferX*1710;
      this.game.nextLeaveShadowEmpireArmoryButton.y = scaleModiferY*10;
      this.game.nextLeaveShadowEmpireArmoryButton.scale.set(videoScale);
    }
  }