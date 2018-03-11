export default class Farm extends Phaser.State {

    preload() {
        this.load.audio('farm_sound', 'audio/farm/piano_rain_terrasound_de.mp3');
        this.game.load.tilemap('map', 'farm/farm2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'farm/tiles-ground.png');
        this.game.load.image('tiles_ball', 'farm/tiles_ball.png');
        this.game.load.spritesheet('damian', 'farm/damian.png', 150, 370);
        this.game.load.spritesheet('damian-armour', 'farm/character_asset_damian_armour_190x260px.png', 190, 260);
        this.game.load.spritesheet('damian-magic', 'farm/character_asset_damian_magicAttackAndWalk_250x260.png', 250, 260);
        this.game.load.spritesheet('damian-sword', 'farm/character_asset_damian_swordAttack_240x350px.png', 240, 350);
        this.game.load.spritesheet('darcono', 'farm/character_asset_darconos_400x620.png', 400, 620);
        this.game.load.spritesheet('darcono-baby', 'farm/character_asset_darcono_baby_280x500.png', 280, 500);
        this.game.load.image('background', 'farm/house_farm_3840x1080px.png');
        this.game.load.image('donut', 'farm/donut-small.png');
        this.game.load.spritesheet('mummy', 'farm/metalslug_mummy37x45.png', 37, 45, 18);
        this.game.load.image('bullet', 'farm/magicBullet_100x100.png');
        this.game.load.spritesheet('kaboom', 'farm/explode.png', 128, 128);
        this.game.load.image('dad', '/farm/character_asset_tamo_140x270.png');
    }

    create() {

        this.map;
        this.tileset;
        this.layer;
        this.player;
        this.facing = 'right';
        this.jumpTimer = 0;
        this.cursors;
        this.jumpButton;
        this.background;

        this.farmBackgroundSound = this.game.add.audio('farm_sound');
        this.farmBackgroundSound.loopFull();
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 1080, 'background');
        this.game.world.setBounds(0, 0, 3840, 1080);
        //this.bg.fixedToCamera = true;

        document.getElementById('textbox').innerHTML = "Hallo Welt";

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.map.addTilesetImage('tiles_ball');
        this.layer = this.map.createLayer('tile-layer_ground');
        //this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4); 

        this.balls = this.game.add.group();
        this.balls.enableBody = true;
        this.map.createFromObjects('object-layer_balls', 5, 'tiles_ball', 0, true, false, this.balls);

        this.game.physics.arcade.gravity.y = 250;


        this.player = this.game.add.sprite(500, 370, 'damian');
        this.player.scale.set(0.8);
    
        this.game.camera.follow(this.player);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        this.player.anchor.set(0.75);

        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(152, 385, 0, 0); // nutzen ist ungewiss

        this.player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
        this.player.animations.add('right', [5, 6, 7, 8, 9], 8, true);


        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        this.dad = this.game.add.sprite(380, 640, 'dad');
    
        this.mummy = this.game.add.sprite(700, 0, 'mummy', 5);
        this.mummy.scale.set(1);
        this.game.physics.enable(this.mummy, Phaser.Physics.ARCADE);
        this.mummy.body.collideWorldBounds = true;

        this.darconoBaby = this.game.add.sprite(3500, 400, 'darcono-baby');
        this.game.physics.enable(this.darconoBaby, Phaser.Physics.ARCADE);
        this.darconoBaby.body.collideWorldBounds = true;
        this.darconoBaby.scale.set(0.5);
        this.darconoBaby.body.bounce.set(1);

        this.darconogroup = this.game.add.group();
        this.darconogroup.createMultiple(1, 'darcono', [0, 1, 2], true);
        this.darconogroup.scale.set(0.4);
        this.darconogroup.enableBody = true;
        this.darconogroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.darconogroup.align(40,-40,400, 600);
        this.darconogroup.x = 3300;
        this.darconogroup.y = 400;


        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.E);

       /* this.weapon = this.game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 800;
        this.weapon.fireRate = 20;
        this.weapon.trackSprite(this.player, 0, 0, true);*/
    
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.forEach(setupInvader, this);

     
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(setupInvader, this);
    

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.input.onDown.add(gofull, this);

        var style = { font: "24px Arial", fill: "#19de65"};

        this.ballCount = 0;
        this.ballText = this.game.add.text(10, 10, "Gesammelte Bälle: "+this.ballCount, style);
    
        function gofull() {
            this.game.scale.startFullScreen();
        }

        function setupTrackSprite(weapon) {
            weapon.trackSprite(this.player, 0, 0, true);
        }
                
        function setupInvader (invader) {
            invader.anchor.x = 0.5;
            invader.anchor.y = 0.5;
            invader.animations.add('kaboom');
        }


        
    }

    update() {
        function collectItem(payer, item) {
            item.kill();
            this.ballText.text = "Gesammelte Bälle: "+ (++this.ballCount);
        }
        function talkeToMummy(payer, item) {
    
            if( this.fKey .isDown) {
                this.fText = this.game.add.text(32, 32, 'Hello i am mummy', { font: "15px Arial", fill: "#19de65" });
            } else {
                this.game.add.text(32, 64, 'Press F to talk to mummy', { font: "15px Arial", fill: "#19de65" });
            }
        }
        function destroyObject(weapon, object) {
            weapon.kill();
            object.kill();

            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(object.body.x, object.body.y);
            explosion.play('kaboom', 30, false, true);
        
        }

        if(this.nKey.isDown) {
            this.farmBackgroundSound.destroy();
            this.state.start('AirshipArrival');
        }


        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.balls, this.layer);
        this.game.physics.arcade.collide(this.darconoBaby, this.layer);
        this.game.physics.arcade.collide(this.darconogroup, this.layer);
        this.game.physics.arcade.collide(this.mummy, this.layer);

        
        this.game.physics.arcade.overlap(this.player, this.mummy, talkeToMummy, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.mummy, destroyObject, null, this);
        this.game.physics.arcade.overlap(this.player, this.balls, collectItem, null, this);

        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown || this.aKey.isDown) {
            this.player.body.velocity.x = -350;
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown || this.dKey.isDown) {
            this.player.body.velocity.x = 350;
            if (this.facing != 'right') {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        } else {
            if (this.facing != 'idle') {
                this.player.animations.stop();
                if (this.facing == 'left') {
                    this.player.frame = 4;
                }
                else {
                    this.player.frame = 5;
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