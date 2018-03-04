export default class Ship extends Phaser.State {

    preload() {
        this.game.load.tilemap('map', 'farm/room.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'farm/tiles-ground.png');
        this.game.load.spritesheet('damian', 'farm/damian.png', 150, 370);
        this.game.load.spritesheet('damian-magic', 'farm/character_asset_damian_magicAttackAndWalk_250x260.png', 250, 260);
        this.game.load.image('background-airship', 'farm/airship_room_1920x1080px.png');
        this.game.load.image('bullet', 'farm/magicBullet_100x100.png');
        this.game.load.spritesheet('kaboom', 'farm/explode.png', 128, 128);
        this.game.load.image('box', 'farm/chest_100x100.png');
    }

    create() 
    {

        this.map;
        this.tileset;
        this.layer;
        this.player;
        this.facing = 'left';
        this.jumpTimer = 0;
        this.cursors;
        this.jumpButton;
        this.bg;
  
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.bg = this.game.add.tileSprite(0, 0, 1920, 1080, 'background-airship');
        this.game.world.setBounds(0, 0, 1920, 1080);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);


        this.game.physics.arcade.gravity.y = 500;

        this.player = this.game.add.sprite(500, 700, 'damian-magic');
        this.player.scale.set(1.3);
    
        this.game.camera.follow(this.player);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        this.player.anchor.set(0.75);
        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(152, 385, 0, 0);
        this.player.animations.add('left', [9, 8, 7, 6], 8, true);
        this.player.animations.add('right', [2, 3, 4, 5], 8, true);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);



        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.input.onDown.add(gofull, this);

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.forEach(setupInvader, this);

     
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(setupInvader, this);


        this.boxgroup = this.game.add.group();
        this.boxgroup.enableBody = true;
        this.boxgroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.boxgroup.createMultiple(5, 'box', [0, 1, 2, 4], true);
        this.boxgroup.align(10,-40,100, 10);
        this.boxgroup.x = 700;
        this.boxgroup.y = 400;

    
        function gofull() {
            this.game.scale.startFullScreen();
        }

        function setupTrackSprite(weapon) {
            weapon.trackSprite(this.player, 0, 0, true);
        }
                
        function setupInvader (invader) {
            invader.anchor.x = -0.5;
            invader.anchor.y = 2.2;
            invader.animations.add('kaboom');
        }

    }

    update() {
        function collectItem(payer, item) {
            item.kill();
        }

        function destroyObject(weapon, object) {
            weapon.kill();
            object.kill();

            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(object.body.x, object.body.y);
            explosion.play('kaboom', 30, false, true);
        
        }
      
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.boxgroup, this.layer);

        
        this.game.physics.arcade.overlap(this.bullets, this.boxgroup, destroyObject, null, this);

        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -350;
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 350;
            if (this.facing != 'right') {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        } else {
            if (this.facing != 'idle') {
                this.player.animations.stop();
                if (this.facing == 'left') {
                    this.player.frame = 11;
                }
                else {
                    this.player.frame = 0;
                }
                this.facing = 'idle';
            }
        }
        
        if (
            this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {

            this.player.body.velocity.y = -250;
            this.jumpTimer = this.game.time.now + 750;
        }

        if (this.game.input.activePointer.isDown) {
            var bullet = this.bullets.getFirstExists(false);
            if (bullet) {
                bullet.reset(this.player.x, this.player.y);
                bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer, 500);
            } 
        }

    
    }

}