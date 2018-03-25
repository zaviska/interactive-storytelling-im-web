import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class Farm extends Phaser.State {

    preload() {
        this.load.audio('farm_sound', 'audio/farm/piano_rain_terrasound_de.mp3');
        this.load.audio('ball_sound', 'audio/sound_effects/balls/ting.mp3');
        this.game.load.tilemap('map', 'image/tilemap/farm.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.image('tiles_ball', 'image/tilemap/tiles_ball.png');
        this.game.load.spritesheet('damian', 'image/characters/damian/damian_room_210x495px.png', 210, 495);
        this.game.load.image('tamo', '/image/characters/tamo/tamo_140x270.png', 140, 270);
        this.game.load.spritesheet('darcono', 'image/characters/darconos/darconos_400x620.png', 400, 620);
        this.game.load.spritesheet('darcono-baby', 'image/characters/darconos/darcono_baby_280x500.png', 280, 500);
        this.game.load.image('background', 'image/background/house_farm_3840x1080px.png');
    }

    create() {
        this.facing = 'left';
        this.jumpTimer = 0;
  
        //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setShowAll();
        window.addEventListener('resize', function () {  
          this.game.scale.refresh();
        });
        this.game.scale.refresh();

        this.farmBackgroundSound = this.game.add.audio('farm_sound');
        this.farmBackgroundSound.loopFull();
        this.ballSound = this.game.add.audio('ball_sound');

        let textBox = this.game.textBox;
        textBox.addText(new Text("KAPITEL 1: BLACK'S DARCONO FARM <hr>"));
        textBox.addText(new Text("Familie Black lebte am Rande der schwebenden Stadt des Königreichs Livania. Sie arbeiteten auf der familiengeführten Darcono Farm. Damian war der älteste Sohn von Tamo und Ava Black und hatte eine jüngere Schwester namens Lina. Er musste viele Aufgaben auf der Darcono Farm übernehmen, die ihn allerdings sehr langweilten. Damian wollte vielmehr ein Luftritter, wie sein Onkel Luan Black, werden. Aber er sollte später einmal die Darcono Farm übernehmen."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Sammle mind. 10 Energie-Bälle und füttere damit die Darconos. Sprich danach mit Tamo Black.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 1080, 'background');
        this.game.world.setBounds(0, 0, 3840, 1080);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.map.addTilesetImage('tiles_ball');
        this.layer = this.map.createLayer('tile-layer_ground');
        //this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4); 

        this.balls = this.game.add.group();
        this.balls.enableBody = true;
        this.map.createFromObjects('object-layer_balls', 5, 'tiles_ball', 0, true, false, this.balls);
        this.itemTaken = false;
        this.itemTakeFText = false;

        this.game.physics.arcade.gravity.y = 250;

        this.darconoOne = this.game.add.sprite(3200, 500, 'darcono');
        this.game.physics.enable(this.darconoOne, Phaser.Physics.ARCADE);
        this.darconoOne.body.collideWorldBounds = true;
        this.darconoOne.scale.set(0.6);
        //this.darconoOne.body.bounce.set(1);

        this.darconoTwo = this.game.add.sprite(3500, 500, 'darcono');
        this.game.physics.enable(this.darconoTwo, Phaser.Physics.ARCADE);
        this.darconoTwo.body.collideWorldBounds = true;
        this.darconoTwo.scale.set(0.6);
        //this.darconoTwo.body.bounce.set(1);

        this.darconoThree = this.game.add.sprite(3600, 500, 'darcono');
        this.game.physics.enable(this.darconoThree, Phaser.Physics.ARCADE);
        this.darconoThree.body.collideWorldBounds = true;
        this.darconoThree.scale.set(0.6);
        this.darconoThree.body.bounce.set(1);

        this.darconoBabyOne = this.game.add.sprite(3400, 600, 'darcono-baby');
        this.game.physics.enable(this.darconoBabyOne, Phaser.Physics.ARCADE);
        this.darconoBabyOne.body.collideWorldBounds = true;
        this.darconoBabyOne.scale.set(0.4);
        this.darconoBabyOne.body.bounce.set(1);

        this.darconoBabyTwo = this.game.add.sprite(3500, 680, 'darcono-baby');
        this.game.physics.enable(this.darconoBabyTwo, Phaser.Physics.ARCADE);
        this.darconoBabyTwo.body.collideWorldBounds = true;
        this.darconoBabyTwo.scale.set(0.4);
        //this.darconoBabyTwo.body.bounce.set(1);
        
        this.darconosFed = false;
        this.darconosFedFText = false;

        this.tamo = this.game.add.sprite(420, 640, 'tamo');
        this.game.physics.enable(this.tamo, Phaser.Physics.ARCADE);
        this.tamo.body.collideWorldBounds = true;
        this.tamo.body.setSize(140, 270, 0, 0);
        this.tamoTalked = false;
        this.tamoTalkFText = false;

        this.player = this.game.add.sprite(700, 800, 'damian');
        this.player.scale.set(0.53);
        this.game.camera.follow(this.player);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.anchor.set(0.75);
        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(210, 495, 0, 0);
        this.player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
        this.player.animations.add('right', [5, 6, 7, 8, 9], 8, true);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        /*
        this.darconogroup = this.game.add.group();
        this.darconogroup.createMultiple(1, 'darcono', [0, 1, 2], true);
        this.darconogroup.scale.set(0.4);
        this.darconogroup.enableBody = true;
        this.darconogroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.darconogroup.align(40,-40,400, 600);
        this.darconogroup.x = 3300;
        this.darconogroup.y = 400;
        */

        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        var style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        this.ballCount = 0;
        this.ballText = this.game.add.text(3500, 400, "Gesammelte Energie-Bälle: "+this.ballCount, style);
    }

    update() {
        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;
        
        /*
        function collectItem(player, item) {
            this.ballSound.play();
            item.kill();
            this.ballText.text = "Gesammelte Energie-Bälle: "+ (++this.ballCount);
        }*/

        if (typeof this.itemText !== undefined && this.itemTaken === true) {
            this.itemText.destroy();
            this.itemTakeFText = false;
        }
        function collectItem(player, item) {
            if (this.fKey.isDown && this.itemTaken === false) {
                this.ballSound.play();
                this.ballText.text = "Gesammelte Energie-Bälle: "+ (++this.ballCount);
                this.game.textBox.addText(new Text("Gesammelte Energie-Bälle: "+ (this.ballCount)));
                item.kill();
            } else if (this.itemTakeFText === false) {
                this.itemTakeFText = true;
                this.itemText = this.game.add.text(this.player.x, this.player.y, 'Drücke F: Energie-Ball nehmen', style);
            }
        }

        function feedDarcono(player, darcono) {
            if (this.fKey.isDown && this.darconosFed === false) {
                this.darconosFed = true;
                //this.darconoText.destroy();
                if (this.ballCount >= 10) {
                    this.ballSound.play();
                    this.darconosFedFText = true;
                    this.game.textBox.addText(new Text("Du hast die Darconos gefüttert."));
                } else {
                    this.game.textBox.addText(new Text("Du hast nicht genug Futter gesammelt. Du brauchst mind. 10 Energie-Bälle."));
                }
            } else if (this.darconosFedFText === false) {
                this.darconosFedFText = true;
                this.darconoText = this.game.add.text(this.darconoOne.x, this.darconoOne.y-50, 'Drücke F: Füttern', style);
            }
        }

        function talkToTamo(player, tamo) {
            if (this.fKey.isDown && this.tamoTalked === false) {
                this.tamoTalked = true;

                window.okAnswer = function() {
                    that.tamoTalked = false;
                    textBox.addText(new Dialog("Beeil dich, es gibt gleich Abendessen.", tamoPerson));
                }
                window.checkTaskAnswer = function() {
                    that.tamoTalked = false;
                    if (that.ballCount >= 10 && that.darconosFed === true) {
                        let goHomeAnswer = [
                            new Answer("Ich möchte noch draußen bleiben.", "okAnswer"),
                            new Answer("Ok.", "startCutSceneAirshipArrival")
                        ];
                        textBox.addText(new Dialog("Sehr gut. Komm doch wieder ins Haus hinein.", tamoPerson));
                        textBox.addText(new Decision(goHomeAnswer));
                    } else {
                        textBox.addText(new Dialog("Ich merke, wenn du mich anlügst. Füttere die Darconos, sonst gibt es kein Abendessen für dich.", tamoPerson));
                    }
                }
                window.startCutSceneAirshipArrival = function() {
                    that.farmBackgroundSound.destroy();
                    that.state.start('AirshipArrival');
                }

                let taskAnswer = [
                    new Answer("Ok.", "okAnswer"),
                    new Answer("Ich habe sie schon gefüttert.", "checkTaskAnswer")
                ];
                let tamoPerson = new Person("Tamo Black", "tamo");
                this.game.textBox.addText(new Dialog("Damian, du musst die Darconos noch füttern.", tamoPerson));
                this.game.textBox.addText(new Decision(taskAnswer));
            } else if (this.tamoTalkFText === false) {
                this.tamoTalkFText = true;
                this.tamoText = this.game.add.text(this.tamo.x, this.tamo.y-50, 'Drücke F: Sprechen', style);
            }
        }

        if (this.nKey.isDown) {
            this.farmBackgroundSound.destroy();
            this.state.start('AirshipArrival');
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.tamo, this.layer);
        this.game.physics.arcade.collide(this.balls, this.layer);
        this.game.physics.arcade.collide(this.darconoOne, this.layer);
        this.game.physics.arcade.collide(this.darconoTwo, this.layer);
        this.game.physics.arcade.collide(this.darconoThree, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyOne, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyTwo, this.layer);
        
        let overlapTamo = this.game.physics.arcade.overlap(this.player, this.tamo, talkToTamo, null, this);
        this.game.physics.arcade.overlap(this.player, this.balls, collectItem, null, this);
        let overlapDarcono = this.game.physics.arcade.overlap(this.player, this.darconoOne, feedDarcono, null, this);

        if (overlapTamo === false && this.tamoTalkFText === true) {
            this.tamoText.destroy();
            this.tamoTalkFText = false;
            this.tamoTalked = false;
        }

        if (overlapDarcono === false && this.darconosFedFText === true) {
            this.darconoText.destroy();
            this.darconosFedFText = false;
        }

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
        
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }
    
    }

}