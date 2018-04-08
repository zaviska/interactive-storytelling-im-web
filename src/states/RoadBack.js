export default class RoadBack extends Phaser.State {

    preload() {
      this.load.video('cut_scene_road_back', 'video/cut_scene/road_back.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneRoadBack = this.game.add.video('cut_scene_road_back');
  
      this.game.videoImageRoadBack = cutSceneRoadBack.addToWorld(0, 0);
      cutSceneRoadBack.play();
      cutSceneRoadBack.onComplete.add(onClickNextButton);
  
      this.game.nextRoadBackButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
      
      function onClickNextButton() {
        cutSceneRoadBack.destroy();
        that.game.nextRoadBackButton.destroy();
        that.state.start('FarmBack');
        that.game.showNavigation();
      }
    }
  
    resize (x, y) {
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageRoadBack.scale.set(videoScale);
  
      this.game.nextRoadBackButton.x = scaleModiferX*1710;
      this.game.nextRoadBackButton.y = scaleModiferY*10;
      this.game.nextRoadBackButton.scale.set(videoScale);
    } 
  }