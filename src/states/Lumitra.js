export default class Lumitra extends Phaser.State {

    preload() {
      this.load.video('cut_scene_lumitra', 'video/cut_scene/lumitra.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneLumitra = this.game.add.video('cut_scene_lumitra');
  
      this.game.videoImageLumitra = cutSceneLumitra.addToWorld(0, 0);
      cutSceneLumitra.play();
      cutSceneLumitra.onComplete.add(onClickNextButton); 
      
      this.game.nextLumitraButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
  
      function onClickNextButton() {
        cutSceneLumitra.destroy();
        that.game.nextLumitraButton.destroy();
        that.state.start('ShipShadowEmpireCellEscape');
        that.game.showNavigation();
      }
    }
    resize (x, y) {
      console.log("SCALE MODE CREATE LUMITRA", x, y);
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageLumitra.scale.set(videoScale);
  
      this.game.nextLumitraButton.x = scaleModiferX*1710;
      this.game.nextLumitraButton.y = scaleModiferY*10;
      this.game.nextLumitraButton.scale.set(videoScale);
    }
  }