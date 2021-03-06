import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipShadowEmpireCellEscape extends Phaser.State {

    preload() {
        this.load.audio('shadow_empire_sound', 'audio/shadow_empire/forgotten-caves_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('sword_sound', 'audio/sound_effects/sword/sword_swing.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.audio('appear_sound', 'audio/sound_effects/appear/appear.mp3');
        this.load.image('bullet', 'image/bullet/magicBullet_100x100.png', 100, 100);
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_red_378x510px.png', 378, 510);
        this.load.spritesheet('tumbra', 'image/characters/tumbras/tumbra_440x260px.png', 440, 260);
        this.load.image('air', 'image/item/yellow.png');
        this.load.tilemap('map', 'image/tilemap/cell_escape_1920x2700px.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.image('marker', 'image/tilemap/marker_30x30px.png');
        this.load.image('background-airship', 'image/background/cell_escape_1920x2700px.png');
    }

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.compatibility.noMargins = true;
        this.facing = 'right';
        this.jumpTimer = 0;
        this.tumbraJumpDownTimer = 0;
        this.tumbraJumpUpTimer = 0;
        this.tumbraAttackTimer = 0;
        this.updateCameraTimer = 0;
        let textBox = this.game.textBox;

        this.shadowEmpireBackgroundSound = this.game.add.audio('shadow_empire_sound');
        this.shadowEmpireBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.swordSound = this.game.add.audio('sword_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
        this.appearSound = this.game.add.audio('appear_sound');
  
        textBox.addText(new Text("KAPITEL 10: DAMIANS AUSBRUCH <hr>"));
        textBox.addText(new Text("Nachdem Damian sein Amulett, aufgrund einer Träne, trocken gerieben hatte, erschien ein Lumitra aus dem Stein. Lumitras waren gute Lichtgeister. Dieses Lichtwesen öffnete Damians verschlossene Zellentür und verschwand danach wieder. Nun konnte Damian aus seiner Zelle ausbrechen."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Breche aus deiner Zelle aus und suche den Ausgang.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 1920, 2700, 'background-airship');
        this.game.world.setBounds(0, 200, 1920, 2700);
        this.game.physics.arcade.setBounds(0, 200, 1920, 2700);

        this.delay = 0;
        for (var i = 0; i < 40; i++) {
            this.air = this.game.add.sprite(-100 + (this.game.world.randomX), 2400, 'air');
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

        this.cell = this.game.add.sprite(1600, 900, 'marker');
        this.game.physics.enable(this.cell, Phaser.Physics.ARCADE);
        this.cell.body.allowGravity = false;
        this.cell.alpha = false;
        this.cellTouched = false;
        this.cellTouchedFText = false;

        this.tumbraOne = this.game.add.sprite(500, 400, 'tumbra');
        this.game.physics.enable(this.tumbraOne, Phaser.Physics.ARCADE);
        this.tumbraOne.body.collideWorldBounds = true;
        this.tumbraOne.body.allowGravity = false;
        this.tumbraOne.health = 30;

        this.tumbraTwo = this.game.add.sprite(800, 400, 'tumbra');
        this.game.physics.enable(this.tumbraTwo, Phaser.Physics.ARCADE);
        this.tumbraTwo.body.collideWorldBounds = true;
        this.tumbraTwo.body.allowGravity = false;
        this.tumbraTwo.health = 30;

        this.tumbraThree = this.game.add.sprite(1100, 600, 'tumbra');
        this.game.physics.enable(this.tumbraThree, Phaser.Physics.ARCADE);
        this.tumbraThree.body.collideWorldBounds = true;
        this.tumbraThree.body.allowGravity = false;
        this.tumbraThree.health = 30;

        this.tumbraFour = this.game.add.sprite(1300, 500, 'tumbra');
        this.game.physics.enable(this.tumbraFour, Phaser.Physics.ARCADE);
        this.tumbraFour.body.collideWorldBounds = true;
        this.tumbraFour.body.allowGravity = false;
        this.tumbraFour.health = 30;

        this.lorcan = this.game.add.sprite(800, 1400, 'lorcan');
        this.lorcan.frame = 4;
        this.game.physics.enable(this.lorcan, Phaser.Physics.ARCADE);
        this.lorcan.body.bounce.y = 0.2;
        this.lorcan.body.collideWorldBounds = true;
        this.lorcan.body.setSize(378, 510, 0, 0);
        this.lorcanTalked = false;
        this.lorcanTalkFText = false;

        function createDamianSword(game) {
            let player = game.add.sprite(0, 0, 'damian-sword');
            player.scale.set(0.75);
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
            let player = game.add.sprite(0, 0, 'damian-magic');
            player.scale.set(0.97);
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
            this.game.mage = true;
            this.player = createDamianMagic(this.game);
        } 
        this.player.setHealth(100); 
        this.player.events.onKilled.add(playerDied, this);

        function playerDied() {
            this.game.lastState = 'ShipShadowEmpireCellEscape';
            this.state.start('GameOver');
        }

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.forEach(setupInvader, this);

        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'explode');

        this.explosions.forEach(setupExplosion, this);   
        function setupInvader(invader) {
            invader.anchor.x = -0.5;
            invader.anchor.y = 2.2;
            invader.animations.add('explode');
        }

        function setupExplosion(invader) {
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
             
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        this.playerHitPointsText = this.game.add.text(10, 730, 'Lebenspunkte Damian: ' + this.player.health, style);
        this.cameraYPosition = Math.ceil(this.player.y) - 200;
    }

    update() {
          /*if (this.nKey.isDown) {
            this.shadowEmpireBackgroundSound.destroy();
            this.state.start('LorcansTransformation');
        }*/

        var cameraMovement = Math.abs(this.cameraYPosition - Math.ceil(this.player.y) + 200);

        if (cameraMovement > 1) {
            this.cameraYPosition = Math.ceil(this.player.y) - 200;
            this.game.camera.setPosition(0, this.cameraYPosition);
        }


        function hitTumbraWithMagic(tumbra, bullet) {
            tumbra.damage(1);
            var explosion = this.explosions.getFirstExists(false);
            if (explosion) {
                explosion.reset(bullet.body.x, bullet.body.y);
                explosion.play('explode', 30, false, true);
            }

            this.explosionSound.play("", 0, 5, false, true);
            bullet.kill();
        }
    
        function slashTumbra(player, tumbra) {
            tumbra.damage(1);
            var explosion = this.explosions.getFirstExists(false);
            if (explosion) {
                explosion.reset(tumbra.body.x, tumbra.body.y);
                explosion.play('explode', 30, false, true);
            }

            this.explosionSound.play("", 0, 5, false, true);
        }

        function tumbraAttacksPlayer(player, tumbra) {
            if (this.game.time.now > this.tumbraAttackTimer) {
                tumbra.damage(1);
                this.tumbraAttackTimer = this.game.time.now + 200;
            }
        }

        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;

        if (this.game.time.now > this.tumbraJumpDownTimer) {
            this.tumbraOne.body.velocity.y = -100;
            this.tumbraTwo.body.velocity.y = -40;
            this.tumbraThree.body.velocity.y = -90;
            this.tumbraFour.body.velocity.y = -120;
            this.tumbraJumpUpTimer = this.game.time.now + 2000;
            this.tumbraJumpDownTimer = this.game.time.now + 4000;
        } else if (this.game.time.now > this.tumbraJumpUpTimer) {
            this.tumbraOne.body.velocity.y = 100;
            this.tumbraTwo.body.velocity.y = 40;
            this.tumbraThree.body.velocity.y = 100;
            this.tumbraFour.body.velocity.y = 100;
        }

        let overlapLorcan = this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);
        if (overlapLorcan === false && this.lorcanTalkFText === true) {
            this.lorcanText.destroy();
            this.lorcanTalkFText = false;
            this.talkToLorcan = false;
        }
        function talkToLorcan() {
            if (this.fKey.isDown && this.lorcanTalked === false) {
                this.lorcanTalked = true;
                let lorcanPerson = new Person("Sir Lorcan", "lorcan");
                window.startCutSceneLorcansTransformation = function() {
                    that.shadowEmpireBackgroundSound.destroy();
                    that.state.start('LorcansTransformation');
                }
                let answer = [
                    new Answer("Weiter", "startCutSceneLorcansTransformation"),
                ];
                this.game.textBox.addText(new Dialog("Du entkommst mir nicht! Ich werde dich jetzt vernichten!", lorcanPerson));
                this.game.textBox.addText(new Decision(answer));
            } else if (this.lorcanTalkFText === false) {
                this.lorcanTalkFText = true;
                this.lorcanText = this.game.add.text(this.lorcan.x, this.lorcan.y-50, 'Drücke F: Sprechen', style);
            }
        }

        this.game.physics.arcade.collide(this.lorcan, this.layer);
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.tumbraOne, this.layer);
        this.game.physics.arcade.collide(this.tumbraTwo, this.layer);
        this.game.physics.arcade.collide(this.tumbraThree, this.layer);
        this.game.physics.arcade.collide(this.tumbraFour, this.layer);

        this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.tumbraOne, hitTumbraWithMagic, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.tumbraTwo, hitTumbraWithMagic, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.tumbraThree, hitTumbraWithMagic, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.tumbraFour, hitTumbraWithMagic, null, this);

        let overlapCell = this.game.physics.arcade.overlap(this.player, this.cell, touchCell, null, this);
        this.fontStyle = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};   
        if (overlapCell === false && this.cellTouchedFText === true) {
            this.cellText.destroy();
            this.cellTouchedFText = false;
        }
        function touchCell() {
            if (this.fKey.isDown && this.cellTouched === false) {
                this.cellTouched = true;
                let cellPerson = new Person("Gefangener", "tamo");
                window.openCell = function() {
                    that.game.textBox.addText(new Dialog("Ich danke dir. Endlich bin ich frei.", cellPerson));
                    that.appearSound.play();
                }
                let answer = [
                    new Answer("Die Zelle mithilfe deines Amuletts öffnen", "openCell"),
                ];
                this.game.textBox.addText(new Dialog("Bitte befreie mich.", cellPerson));
                this.game.textBox.addText(new Decision(answer));
            } else if (this.cellTouchedFText === false) {
                this.cellTouchedFText = true;
                this.cellText = this.game.add.text(this.cell.x-70, this.cell.y-50, 'Drücke F: Sprechen', this.fontStyle);
            }
        }

        let knightAttacks = (this.game.input.activePointer.isDown || this.strgKey.isDown) && this.game.knight;

        if (knightAttacks) {
            this.game.physics.arcade.overlap(this.player, this.tumbraOne, slashTumbra, null, this);
            this.game.physics.arcade.overlap(this.player, this.tumbraTwo, slashTumbra, null, this);
            this.game.physics.arcade.overlap(this.player, this.tumbraThree, slashTumbra, null, this);
            this.game.physics.arcade.overlap(this.player, this.tumbraFour, slashTumbra, null, this);
        } else {
            this.game.physics.arcade.overlap(this.tumbraOne, this.player, tumbraAttacksPlayer, null, this);
            this.game.physics.arcade.overlap(this.tumbraTwo, this.player, tumbraAttacksPlayer, null, this);
            this.game.physics.arcade.overlap(this.tumbraThree, this.player, tumbraAttacksPlayer, null, this);
            this.game.physics.arcade.overlap(this.tumbraFour, this.player, tumbraAttacksPlayer, null, this);
        }

        this.playerHitPointsText.setText('Lebenspunkte Damian: ' + this.player.health, true); 

        this.player.body.velocity.x = 0;
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }
        if (this.game.input.activePointer.isDown || this.strgKey.isDown) {
            if (this.game.mage === true) {
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
            } else if (this.game.knight === true) {
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