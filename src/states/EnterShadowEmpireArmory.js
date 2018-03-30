export default class EnterShadowEmpireArmory extends Phaser.State {

    preload() {
      this.load.video('cut_scene_enter_shadow_empire_armory', 'video/cut_scene/enter_shadow_empire_armory.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneEnterShadowEmpireArmory = this.game.add.video('cut_scene_enter_shadow_empire_armory');
  
      this.game.videoImageEnterShadowEmpireArmory = cutSceneEnterShadowEmpireArmory.addToWorld(0, 0);
      cutSceneEnterShadowEmpireArmory.play();
      cutSceneEnterShadowEmpireArmory.onComplete.add(onClickNextButton); 
      
      this.game.nextEnterShadowEmpireArmoryButton = this.game.add.button(1730, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
  
      function onClickNextButton() {
        cutSceneEnterShadowEmpireArmory.destroy();
        that.game.nextEnterShadowEmpireArmoryButton.destroy();
        that.state.start('ShipShadowEmpireArmory');
        that.game.showNavigation();
      }
    }
    resize (x, y) {
      console.log("SCALE MODE CREATE ENTER SHADOW EMPIRE ARMORY", x, y);
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageEnterShadowEmpireArmory.scale.set(videoScale);
  
      this.game.nextEnterShadowEmpireArmoryButton.x = scaleModiferX*1730;
          this.game.nextEnterShadowEmpireArmoryButton.y = scaleModiferY*10;
    }
  }