import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class FarmAfterVisit extends Phaser.State {

    preload() {
        this.load.audio('farm_sound', 'audio/farm/piano_rain_terrasound_de.mp3');
        this.game.load.tilemap('map', 'image/tilemap/farm.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.spritesheet('damian', 'image/characters/damian/damian_room_210x495px.png', 210, 495);
        this.game.load.image('tamo', '/image/characters/tamo/tamo_140x270.png', 140, 270);
        this.game.load.spritesheet('darcono', 'image/characters/darconos/darconos_400x620.png', 400, 620);
        this.game.load.spritesheet('darcono-baby', 'image/characters/darconos/darcono_baby_280x500.png', 280, 500);
        this.game.load.image('background', 'image/background/house_farm_3840x900px.png');
        
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

        let textBox = this.game.textBox;
        textBox.addText(new Text("KAPITEL 2: SIR LORCAN'S ANGEBOT <hr>"));
        textBox.addText(new Text("Kapitän Sir Lorcan bat Tamo Black, seinen Sohn zum Luftritter ausbilden zu lassen. Die Reise sollte für Damian noch heute beginnen. Damian war über diese Chance überaus glücklich... doch sein Vater lehnte das Angebot ab. Sir Lorcan gab der Familie Black Bedenkzeit. Das Luftschiff wartete nur eine Nacht. Damian sollte auf das Luftschiff kommen, noch bevor die Sonne aufgeht. Ansonsten wird das Luftschiff ohne ihn weiterziehen."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Überzeuge Tamo davon, auf das Luftschiff gehen zu dürfen.</i></span>"));

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 900, 'background');
        this.game.world.setBounds(0, 0, 3840, 900);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        //this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4); 

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

        this.tamo = this.game.add.sprite(420, 600, 'tamo');
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

        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    }

    update() {
        let textBox = this.game.textBox;
        let that = this;
      
        var style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        function talkToTamo(player, tamo) {
            if (this.fKey.isDown && this.tamoTalked === false) {
                this.tamoTalked = true;
                let tamoPerson = new Person("Tamo Black", "tamo");
                window.calmAnswer1 = function() {
                    that.tamoTalked = false;
                    let airshipQuestion = [
                        new Answer("Warum darf ich kein Luftritter werden?", "calmAnswer2"),
                        new Answer("Wieso lässt du mich nicht selbst entscheiden, was ich werden will?", "angryAnswer"),
                    ];
                    textBox.addText(new Dialog("Ja, mein Sohn. Was gibt es denn?", tamoPerson));
                    textBox.addText(new Decision(airshipQuestion));
                }
                window.calmAnswer2 = function() {
                    that.tamoTalked = false;
                    let farmpQuestion = [
                        new Answer("Ich möchte aber lieber Luftritter werden.", "angryAnswer"),
                        new Answer("Meine Schwester Lina könnte die Darcono Farm doch auch übernehmen.", "angryAnswer"),
                    ];
                    textBox.addText(new Dialog("Du sollst doch die Darcono Farm später übernehmen. Wir zählen auf dich.", tamoPerson));
                    textBox.addText(new Decision(farmpQuestion));
                }
                window.angryAnswer = function() {
                    that.tamoTalked = false;
                    let angryDecision = [
                        new Answer("Ok.", "startStateRoom"),
                        new Answer("Was? Aber...?", "startStateRoom"),
                        new Answer("Hausarrest? Das ist mir egal, ich gehe trotzdem auf das Luftschiff!", "startStateRoom")
                    ];
                    textBox.addText(new Dialog("Was fällt dir ein? Geh auf dein Zimmer! Du bekommst Hausarrest!", tamoPerson));
                    textBox.addText(new Decision(angryDecision));
                }
                window.startStateRoom = function() {
                    that.farmBackgroundSound.destroy();
                    that.state.start('Room');
                }
                let taskAnswer = [
                    new Answer("Warum hast du abgelehnt? Warum fragst du mich nicht, was ICH will? Ich möchte doch Luftritter werden!", "angryAnswer"),
                    new Answer("Kann ich dich etwas fragen?", "calmAnswer1")
                ];
                this.game.textBox.addText(new Dialog("Was stehst du hier noch rum? Gehe ins Haus, es gibt gleich Abendessen.", tamoPerson));
                this.game.textBox.addText(new Decision(taskAnswer));
            } else if (this.tamoTalkFText === false) {
                this.tamoTalkFText = true;
                this.TamoText = this.game.add.text(this.tamo.x, this.tamo.y-50, 'Drücke F: Sprechen', style);
            }
        }

        if (this.nKey.isDown) {
            this.farmBackgroundSound.destroy();
            this.state.start('Room');
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.tamo, this.layer);
        this.game.physics.arcade.collide(this.darconoOne, this.layer);
        this.game.physics.arcade.collide(this.darconoTwo, this.layer);
        this.game.physics.arcade.collide(this.darconoThree, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyOne, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyTwo, this.layer);
        
        let overlapTamo = this.game.physics.arcade.overlap(this.player, this.tamo, talkToTamo, null, this);

        if (overlapTamo === false && this.tamoTalkFText === true) {
            this.TamoText.destroy();
            this.tamoTalkFText = false;
            this.tamoTalked = false;
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