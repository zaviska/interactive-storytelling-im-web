import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipEnimies extends Phaser.State {

    preload() {
        this.load.audio('enimies_sound', 'audio/enimies/pole_position_terrasound.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('sword_sound', 'audio/sound_effects/sword/sword_swing.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.image('bullet', 'image/bullet/magicBullet_100x100.png', 100, 100);
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.load.spritesheet('tumbra', 'image/characters/tumbras/tumbra_440x260px.png', 440, 260);
        this.load.tilemap('map', 'image/tilemap/room_3840px.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.image('background-airship', 'image/background/airship_room_3840x1080px.png');
    }

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        let that = this;
        this.facing = 'right';
        this.jumpTimer = 0;
        let textBox = this.game.textBox;

        this.enimiesBackgroundSound = this.game.add.audio('enimies_sound');
        this.enimiesBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.swordSound = this.game.add.audio('sword_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
  
        textBox.addText(new Text("KAPITEL 6: DIE TUMBRAS: ANGRIFF DER SCHATTENGEISTER <hr>"));
        textBox.addText(new Text("Das Luftschiff wurde einestages von Schattengeistern angegriffen, die sich <i>Tumbras</i> nennen. Alle Luftritter kämpften gegen die Schattengeister und versuchten die Lehrlinge ebenfalls zu beschützen. Nur Damian war so mutig sich zu verteidigen und ebenfalls gegen die Tumbras zu kämpfen."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Besiege die Tumbras.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 1080, 'background-airship');
        this.game.world.setBounds(0, 0, 3840, 1080);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);

        this.game.physics.arcade.gravity.y = 500;

        this.tumbraOne = this.game.add.sprite(500, 400, 'tumbra');
        this.game.physics.enable(this.tumbraOne, Phaser.Physics.ARCADE);
        this.tumbraOne.body.collideWorldBounds = true;

        this.tumbraTwo = this.game.add.sprite(1000, 400, 'tumbra');
        this.game.physics.enable(this.tumbraTwo, Phaser.Physics.ARCADE);
        this.tumbraTwo.body.collideWorldBounds = true;

        this.tumbraThree = this.game.add.sprite(1500, 400, 'tumbra');
        this.game.physics.enable(this.tumbraThree, Phaser.Physics.ARCADE);
        this.tumbraThree.body.collideWorldBounds = true;

        this.tumbraFour = this.game.add.sprite(2000, 400, 'tumbra');
        this.game.physics.enable(this.tumbraFour, Phaser.Physics.ARCADE);
        this.tumbraFour.body.collideWorldBounds = true;
        
        function createDamianSword(game) {
            let player = game.add.sprite(0, 100, 'damian-sword');
            player.scale.set(0.75);
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(610, 880, 0, 0);
            player.animations.add('left', [10, 11, 12, 13], 8, true);
            player.animations.add('right', [16, 17, 18, 19], 8, true);
            player.animations.add('slashRight', [5, 6, 7, 8, 9], 16 );
            player.animations.add('slashLeft', [4, 3, 2, 1, 0], 16 );
            return player;
        }
        function createDamianMagic(game) {
            let player = game.add.sprite(0, 100, 'damian-magic');
            player.scale.set(0.97);
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(500, 500, 0, 0);
            player.animations.add('left', [9, 8, 7, 6], 8, true);
            player.animations.add('right', [2, 3, 4, 5], 8, true);
            player.animations.add('shootRight', [1, 0]);
            player.animations.add('shootLeft', [10, 11]);
            return player;
        }
        if (this.game.knight === true) {
            this.player = createDamianSword(this.game);
        } else {
            this.player = createDamianMagic(this.game);
        }

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.forEach(setupInvader, this);

        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'explode');

        this.explosions.forEach(setupInvader, this);
        function setupTrackSprite(weapon) {
            weapon.trackSprite(this.player, 0, 0, true);
        }     
        function setupInvader(invader) {
            invader.anchor.x = -0.5;
            invader.anchor.y = 2.2;
            invader.animations.add('explode');
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.strgKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    }

    update() {
        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;

        if (this.nKey.isDown) {
            this.enimiesBackgroundSound.destroy();
            if (this.game.knight === true) {
                this.state.start('ShipTestArmory');
            } else {
                this.state.start('ShipTestLibrary');
            } 
        }  

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.tumbraOne, this.layer);
        this.game.physics.arcade.collide(this.tumbraTwo, this.layer);
        this.game.physics.arcade.collide(this.tumbraThree, this.layer);
        this.game.physics.arcade.collide(this.tumbraFour, this.layer);


        this.player.body.velocity.x = 0;
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }
        if (this.game.input.activePointer.isDown || this.strgKey.isDown) {
            if(this.game.mage === true) {
                var bullet = this.bullets.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.player.x+350, this.player.y+300);
                    bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer, 1000);
                    this.shootSound.play();
                    if (this.facing == 'idleRight') {
                        this.player.animations.play('shootRight');
                        this.facing == "idleRight";
                    } else if (this.facing == 'idleLeft') {
                        this.player.animations.play('shootLeft');
                        this.facing == "idleLeft";
                    }
                    
                }
            } else if(this.game.knight === true) {
                this.swordSound.play();
                //this.game.physics.arcade.overlap(this.player, this.box1, slashObject, null, this);
                if (this.facing == 'idleRight' || this.facing == 'right') {
                    this.player.animations.play('slashRight');
                    this.facing == "idleRight";
                } else if (this.facing == 'idleLeft' || this.facing == 'left') {
                    this.player.animations.play('slashLeft');
                    this.facing == "idleLeft";
                }
            }
        } else if (this.cursors.left.isDown || this.aKey.isDown) {
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
            if (this.facing != 'idleRight' || this.facing != 'idleLeft') {
                this.player.animations.stop();
                if (this.game.knight === true) {
                    if (this.facing == 'left') {
                        this.player.frame = 14;
                        this.facing = 'idleLeft';
                    } else if (this.facing == 'right') {
                        this.player.frame = 15;
                        this.facing = 'idleRight';
                    }
                } else if (this.game.mage === true) {
                    if (this.facing == 'left') {
                        this.player.frame = 11;
                        this.facing = 'idleLeft';
                    } else if (this.facing == 'right') {
                        this.player.frame = 0;
                        this.facing = 'idleRight';
                    }
                } else {
                    if (this.facing == 'left') {
                        this.player.frame = 4;
                        this.facing = 'idleLeft';
                    } else if (this.facing == 'right') {
                        this.player.frame = 5;
                        this.facing = 'idleRight';
                    }
                }
            }
        }
    }

}