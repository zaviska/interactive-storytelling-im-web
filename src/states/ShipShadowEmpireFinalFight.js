import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipShadowEmpireFinalFight extends Phaser.State {

    preload() {
        this.load.audio('final_fight_sound', 'audio/final_fight/accelerator_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('sword_sound', 'audio/sound_effects/sword/sword_swing.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.image('bullet', 'image/bullet/magicBullet_100x100.png', 100, 100);
        this.load.image('green', 'image/bullet/lorcanBullet_100x100.png', 100, 100);
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_schattengeist_800x800px.png', 800, 800);
        this.load.image('air', 'image/item/yellow.png');
        this.load.tilemap('map', 'image/tilemap/room_1920px.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.image('background-airship', 'image/background/airship_shadow_empire_final_fight_1920x900px.png');
    }

    create() {
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        let that = this;
        this.facing = 'right';
        this.jumpTimer = 0;
        let textBox = this.game.textBox;

        this.finalFightBackgroundSound = this.game.add.audio('final_fight_sound');
        this.finalFightBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.swordSound = this.game.add.audio('sword_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
  
        textBox.addText(new Text("KAPITEL 11: SIR LORCAN'S VERWANDLUNG <hr>"));
        textBox.addText(new Text("Sir Lorcan zeigte sein wahres Gesicht. Er war ein Schattengeist."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Besiege den Schattengeist Lorcan.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 900, 'background-airship');
        this.game.world.setBounds(0, 0, 1920, 900);

        this.delay = 0;
        for (var i = 0; i < 40; i++) {
            this.air = this.game.add.sprite(-100 + (this.game.world.randomX), 600, 'air');
            this.air.scale.set(this.game.rnd.realInRange(0.1, 0.6));
            this.speed = this.game.rnd.between(4000, 6000);
            this.game.add.tween(this.air).to({ y: -256 }, this.speed, Phaser.Easing.Sinusoidal.InOut, true, this.delay, 1000, false);
            this.delay += 200;
        }

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);

        this.game.physics.arcade.gravity.y = 500;

        this.lorcan = this.game.add.sprite(860, 0, 'lorcan');
        this.game.physics.enable(this.lorcan, Phaser.Physics.ARCADE);
        this.lorcan.body.bounce.y = 0.2;
        this.lorcan.body.collideWorldBounds = true;
        this.lorcan.body.setSize(800, 800, 0, 0);
        this.lorcan.body.bounce.set(1);
        this.lorcan.setHealth(1200);
        this.lorcanTalked = false;
        this.lorcanTalkFText = false;
        this.lorcan.events.onKilled.add(lorcanDied, this);

        function lorcanDied(lorcan) {
            console.log("Lorcan died", lorcan);
            window.startCutSceneShipReward = function() {
                that.finalFightBackgroundSound.destroy();
                that.state.start('ShipReward');
            }
            let backToShip = [
                new Answer("Weiter", "startCutSceneShipReward"),
            ];
            this.game.textBox.addText(new Text("Du hast den Schattengeist Lorcan besiegt."));
            this.game.textBox.addText(new Text("Das Schattenreich löst sich langsam auf und alle Gefangene werden dadurch befreit."));
            this.game.textBox.addText(new Decision(backToShip));
        }
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
            player.body.setSize(200, 500, 0, 0);
            player.animations.add('left', [9, 8, 7, 6], 8, true);
            player.animations.add('right', [2, 3, 4, 5], 8, true);
            player.animations.add('shootRight', [1, 0]);
            player.animations.add('shootLeft', [10, 11]);
            return player;
        }
        if (this.game.knight === true) {
            this.player = createDamianSword(this.game);
        } else {
            this.game.mage = true;
            this.player = createDamianMagic(this.game);
        }
        this.player.setHealth(100);
        this.player.events.onKilled.add(playerDied, this);

        function playerDied(player) {
            this.game.lastState = 'ShipShadowEmpireFinalFight';
            this.state.start('GameOver');
        }

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.forEach(setupPlayerBullets, this);

        this.bossBullets = this.game.add.group();
        this.bossBullets.enableBody = true;
        this.bossBullets.scale.set(1.5);
        this.bossBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bossBullets.createMultiple(10, 'green', 0, false);
        this.bossBullets.setAll('outOfBoundsKill', true);
        this.bossBullets.setAll('checkWorldBounds', true);
        this.bossBullets.forEach(setupBossBullets, this);

        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'explode');

        this.explosions.forEach(setupInvader, this);
        function setupTrackSprite(weapon) {
            weapon.trackSprite(this.player, 0, 0, true);
        }     

        function setupBossBullets(invader) {
            invader.anchor.x = 1;
            invader.anchor.y = 1;
            invader.body.allowGravity = false;
            invader.animations.add('explode');
        }
        function setupPlayerBullets(player) {
            player.anchor.x = -0.5;
            player.anchor.y = 2.2;
            player.body.allowGravity = false;
            player.animations.add('explode');
        }
        function setupInvader(invader) {
            invader.anchor.x = 0;
            invader.anchor.y = 0;
            invader.animations.add('explode');
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.strgKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        
        this.endBossHitPointsText = this.game.add.text(10, 10, 'Lebenspunkte Endboss: ' + this.lorcan.health, style);
        this.playerHitPointsText = this.game.add.text(10, 50, 'Lebenspunkte Damian: ' + this.player.health, style);
    }

    update() {
        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;
        let knightAttacks = (this.game.input.activePointer.isDown || this.strgKey.isDown) && this.game.knight;
    
        if (this.nKey.isDown) {
            this.finalFightBackgroundSound.destroy();
            this.state.start('ShipReward');
        }  

        function hitEndBossWithMagic(boss, bullet) {
            boss.damage(1);
            this.endBossHitPointsText.setText('Lebenspunkte Endboss: ' + boss.health, true);
            var explosion = this.explosions.getFirstExists(false);
            if(explosion) {
                explosion.reset(bullet.body.x, bullet.body.y);
                explosion.play('explode', 30, false, true);
            }

            this.explosionSound.play("", 0, 5, false, true);
            bullet.kill();
        }
        
        function hitPlayerWithBullets(player, bullet) {
            if(!knightAttacks || this.game.mage === true) {
                player.damage(1);
                this.playerHitPointsText.setText('Lebenspunkte Damian: ' + player.health, true); 
            }
            var explosion = this.explosions.getFirstExists(false);
            if(explosion) {
                explosion.reset(bullet.body.x, bullet.body.y);
                explosion.play('explode', 30, false, true);
            }

            this.explosionSound.play("", 0, 5, false, true);
        
            bullet.kill();
        }

        function bulletHitBullets(bullet, bossBullet) {
            bullet.kill();
            bossBullet.kill();
            var explosion = this.explosions.getFirstExists(false);
            if(explosion) {
                explosion.reset(bullet.body.x, bullet.body.y);
                explosion.play('explode', 30, false, true);
            }

            this.explosionSound.play("", 0, 5, false, true);
        }
    
        function slashBoss(player, boss) {
            boss.damage(1);
            this.endBossHitPointsText.setText('Lebenspunkte Endboss:' + boss.health, true);
        }

        if(this.lorcan.alive) {
            var bossBullets = this.bossBullets.getFirstExists(false);
            if (bossBullets) {
                bossBullets.reset(this.lorcan.x+350, this.lorcan.y+300);
                let x = Math.round(Math.random()) * 1920;
                let y = Math.random() * 900;
                console.log("X, Y", x, y);
                bossBullets.rotation = this.game.physics.arcade.moveToXY(bossBullets, x, y, 400);
            }
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.lorcan, this.layer);

        this.game.physics.arcade.overlap(this.bullets, this.lorcan, hitEndBossWithMagic, null, this);
        this.game.physics.arcade.overlap(this.bossBullets, this.player, hitPlayerWithBullets, null, this);
        this.game.physics.arcade.overlap(this.bossBullets, this.bullets, bulletHitBullets, null, this);
        this.game.physics.arcade.overlap(this.player, this.lorcan, slashBoss, null, this);

        this.player.body.velocity.x = 0;
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -550;
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