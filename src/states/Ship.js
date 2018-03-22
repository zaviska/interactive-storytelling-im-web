import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class Ship extends Phaser.State {

    preload() {
        this.load.audio('fight_tutorial_sound', 'audio/fight_tutorial/liquid-energy_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.game.load.tilemap('map', 'image/tilemap/room_airship.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.spritesheet('damian_amulet', 'image/characters/damian/damian_amulet_room_210x495px.png', 210, 495);
        this.game.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_250x260.png', 250, 260);
        this.game.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.game.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_190x260px.png', 190, 260);
        this.game.load.image('background-airship', 'image/background/airship_room_3840x1080px.png');
        this.game.load.image('bullet', 'image/bullet/magicBullet_100x100.png', 100, 100);
        this.game.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.game.load.image('box', 'image/item/chest_100x100.png', 100, 100);
    }

    create() {
        this.facing = 'right';
        this.jumpTimer = 0;
        let textBox = this.game.textBox;
        
        window.shipAnswer1 = function() {
            textBox.addText(new Text("Antwort 1 wurde ausgewählt"));
        }

        let damianPerson = new Person("Damian", "damian");
        let answers = [
            new Answer("Antowort 1", "shipAnswer1"),
            new Answer("Antwort 2")
        ]
        this.game.textBox.addText(new Text("Ship level was started"));
        this.game.textBox.addText(new Dialog("Hallo mein Name ist Damian", damianPerson));
        this.game.textBox.addText(new Decision(answers));
    
        
        this.fightTutorialBackgroundSound = this.game.add.audio('fight_tutorial_sound');
        this.fightTutorialBackgroundSound.loopFull();

        this.explosionSound = this.game.add.audio('explosion_sound');
        this.shootSound = this.game.add.audio('shoot_sound');
  
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

        this.box1 = this.game.add.sprite(2610, 200, 'box');
        this.game.physics.enable(this.box1, Phaser.Physics.ARCADE);
        this.box1.body.collideWorldBounds = true;
        this.box1.body.bounce.set(1);

        this.box2 = this.game.add.sprite(3060, 0, 'box');
        this.game.physics.enable(this.box2, Phaser.Physics.ARCADE);
        this.box2.body.collideWorldBounds = true;
        this.box2.body.bounce.set(1);

        this.box3 = this.game.add.sprite(3505, 300, 'box');
        this.game.physics.enable(this.box3, Phaser.Physics.ARCADE);
        this.box3.body.collideWorldBounds = true;
        this.box3.body.bounce.set(1);

        this.lorcan = this.game.add.sprite(1000, 300, 'lorcan');
        this.lorcan.scale.set(2);
        this.lorcan.frame = 4;
        this.game.physics.enable(this.lorcan, Phaser.Physics.ARCADE);
        this.lorcan.body.bounce.y = 0.2;
        this.lorcan.body.collideWorldBounds = true;
        this.lorcan.body.setSize(190, 260, 0, 0);
        
        this.player = createDamian(this.game);
        function createDamian(game) {
            let player = game.add.sprite(0, 0, 'damian_amulet');
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(210, 495, 0, 0);
            player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
            player.animations.add('right', [5, 6, 7, 8, 9], 8, true);
            return player;
        }
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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

       /*
        this.boxgroup = this.game.add.group();
        this.boxgroup.enableBody = true;
        this.boxgroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.boxgroup.createMultiple(5, 'box', [0, 1, 2, 4], true);
        this.boxgroup.align(100,-40,100, 10);
        this.boxgroup.x = 2000;
        this.boxgroup.y = 400;
        this.boxgroup.body.collideWorldBounds = true;
        this.boxgroup.body.gravity.x = game.rnd.integerInRange(-50, 50);
        this.boxgroup.body.gravity.y = 100 + Math.random() * 100;
        this.boxgroup.body.bounce.setTo(0.9, 0.9);
        */

        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

        function setupTrackSprite(weapon) {
            weapon.trackSprite(this.player, 0, 0, true);
        }
                
        function setupInvader(invader) {
            invader.anchor.x = -0.5;
            invader.anchor.y = 2.2;
            invader.animations.add('explode');
        }

    }

    update() {
        function createDamianMagic(game, x, y) {
            let player = game.add.sprite(x, y, 'damian-magic');
            player.scale.set(1.9);
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(250, 260, 0, 0);
            player.animations.add('left', [9, 8, 7, 6], 8, true);
            player.animations.add('right', [2, 3, 4, 5], 8, true);
            player.animations.add('shootRight', [1, 0]);
            player.animations.add('shootLeft', [10, 11]);
            return player;
        }
        function createDamianSword(game, x, y) {
            let player = game.add.sprite(x, y, 'damian-sword');
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(610, 880, 0, 0);
            player.animations.add('left', [10, 11, 12, 13], 8, true);
            player.animations.add('right', [16, 17, 18, 19], 8, true);
            player.animations.add('shootRight', [5, 6, 7, 8, 9]);
            player.animations.add('shootLeft', [4, 3, 2, 1, 0]);
            return player;
        }
        function collectItem(player, item) {
            item.kill();
        }

        if (this.nKey.isDown) {
            this.fightTutorialBackgroundSound.destroy();
            this.state.start('Intro');
        }  

        function talkToLorcan(player, item) {
            if( this.lorcanHatDamianBegrüßt) {
                
            }
            if (this.fKey.isDown && !this.lorcanHatDamianBegrüßt) {
                if(sprechText) {
                    sprechText.destroy();
                }
                let x = this.player.x;
                let y = this.player.y;
                this.player.destroy();
                //this.player = createDamianMagic(this.game, x, y);
                this.player = createDamianSword(this.game, x, y);
                this.fText = this.game.add.text(900, 900, 'Hallo Damian', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
                this.lorcanHatDamianBegrüßt = true;
            } else {
                var sprechText = this.game.add.text(1100, 300, 'Drücke F: sprechen', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
            }
        }

        function destroyObject(weapon, object) {
            weapon.kill();
            object.kill();

            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(object.body.x, object.body.y);
            explosion.play('explode', 30, false, true);

            this.explosionSound.play("", 0, 5, false, true);
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.lorcan, this.layer);
        this.game.physics.arcade.collide(this.box1, this.layer);
        this.game.physics.arcade.collide(this.box2, this.layer);
        this.game.physics.arcade.collide(this.box3, this.layer);
        //this.game.physics.arcade.collide(this.boxgroup, this.layer);

        this.game.physics.arcade.overlap(this.bullets, this.box1, destroyObject, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.box2, destroyObject, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.box3, destroyObject, null, this);
        //this.game.physics.arcade.overlap(this.bullets, this.boxgroup, destroyObject, null, this);
        this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);

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
            if (this.facing != 'idleRight' || this.facing != 'idleLeft') {
                this.player.animations.stop();
                if (this.facing == 'left') {
                    this.player.frame = 4;
                    this.facing = 'idleLeft';
                } else if (this.facing == 'right') {
                    this.player.frame = 5;
                    this.facing = 'idleRight';
                }
                //this.facing = 'idle';
            }
        }
        
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }

        if (this.game.input.activePointer.isDown) {
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
        } 

    
    }

}