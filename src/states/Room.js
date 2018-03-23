import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class Room extends Phaser.State {

    preload() {
        this.load.audio('escape_way_sound', 'audio/escape_way/criminal-cat_terrasound_de.mp3');
        this.load.audio('drawer_opening_sound', 'audio/sound_effects/drawer/drawer_opening.mp3');
        this.load.audio('door_unlock_sound', 'audio/sound_effects/door/door_unlock.mp3');
        this.load.audio('pick_sound', 'audio/sound_effects/pick/click.mp3');
        this.load.audio('window_sound', 'audio/sound_effects/window/old_door_creaking.mp3');
        this.game.load.tilemap('map', 'image/tilemap/room.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.spritesheet('damian', 'image/characters/damian/damian_room_210x495px.png', 210, 495);
        this.game.load.spritesheet('damian_amulet', 'image/characters/damian/damian_amulet_room_210x495px.png', 210, 495);
        this.game.load.image('background-room', 'image/background/house_room_1920x1080px.png');
        this.game.load.image('bag', 'image/item/backpack_115_155px.png');
        this.game.load.image('marker', 'image/tilemap/marker_30x30px.png');
    }

    create() {
        this.facing = 'right';
        this.jumpTimer = 0;
        
        this.escapeWayBackgroundSound = this.game.add.audio('escape_way_sound');
        this.escapeWayBackgroundSound.loopFull();

        this.drawerOpeningSound = this.game.add.audio('drawer_opening_sound');
        this.doorUnlockSound = this.game.add.audio('door_unlock_sound');
        this.pickSound = this.game.add.audio('pick_sound');
        this.windowSound = this.game.add.audio('window_sound');

        let textBox = this.game.textBox;
        textBox.addText(new Text("KAPITEL 3: DAMIAN'S FLUCHT <hr>"));
        textBox.addText(new Text("Damian bekam von seinem Vater Hausarrest und befand sich jetzt in seinem Zimmer. Er wollte um jeden Preis Luftritter werden, auch wenn er sich aus dem Zimmer schleichen musste. Er bereitete sich auf sein Abenteuer vor, indem er alles Wichtige in einen Rucksack packte."));
        textBox.addText(new Text("Zudem erinnerte sich Damian, wie sein Luftritter-Onkel ihm vor einiger Zeit ein Amulett schenkte. Sein Onkel Luan gab es ihm mit den Worten »trage es auf Reisen, es wird dich in Not beschützen«. Dieses Amulett wollte Damian unbedingt mitnehmen, nur hatte er vergessen, wo es sich befindet."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Schleiche dich aus dem Haus und steige in das Luftschiff ein. Vergesse nicht den Rucksack und das Amulett mitzunehmen.</i></span>"));
  
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 1920, 1080, 'background-room');
        this.game.world.setBounds(0, 0, 1920, 1080);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);

        this.game.physics.arcade.gravity.y = 250;

        this.player = createDamian(this.game);

        function createDamian(game) {
            let player = game.add.sprite(500, 700, 'damian');
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.anchor.set(0.75);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(210, 495, 0, 0);
            player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
            player.animations.add('right', [5, 6, 7, 8, 9], 8, true);
            return player;
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
        this.door = this.game.add.sprite(90, 500, 'marker');
        this.game.physics.enable(this.door, Phaser.Physics.ARCADE);
        this.door.body.allowGravity = false;
        this.door.visible = false;
        this.doorOpened = false;
        this.doorOpenedFText = false;

        this.drawer = this.game.add.sprite(1000, 600, 'marker');
        this.game.physics.enable(this.drawer, Phaser.Physics.ARCADE);
        this.drawer.body.allowGravity = false;
        this.drawer.visible = false;
        this.drawerOpened = false;
        this.drawerOpenedFText = false;
        this.amulet = false;

        this.bag = this.game.add.sprite(1400, 700, 'bag');
        this.game.physics.enable(this.bag, Phaser.Physics.ARCADE);
        this.bag.body.collideWorldBounds = true;
        this.bagTaken = false;
        this.bagTakeFText = false;

        this.window = this.game.add.sprite(1700, 500, 'marker');
        this.game.physics.enable(this.window, Phaser.Physics.ARCADE);
        this.window.body.allowGravity = false;
        this.window.visible = false;
        this.windowOpened = false;
        this.windowOpenedFText = false;

        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        
        /*
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.input.onDown.add(gofull, this);
    
        function gofull() {
            this.game.scale.startFullScreen();
        }
        */
    }

    update() {
        if (this.nKey.isDown) {
            this.escapeWayBackgroundSound.destroy();
            this.state.start('FarmEscapeWay');
        }

        function createDamianAmulet(game, x, y) {
            let player = game.add.sprite(x, y, 'damian_amulet');
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.anchor.set(0.75);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(210, 495, 0, 0);
            player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
            player.animations.add('right', [5, 6, 7, 8, 9], 8, true);
            return player;
        }

        function collectItem(player, item) {
            item.kill();
        }
      
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.bag, this.layer);

        this.game.physics.arcade.overlap(this.player, this.bag, takeBag, null, this);
        this.game.physics.arcade.overlap(this.player, this.door, openDoor, null, this);
        this.game.physics.arcade.overlap(this.player, this.window, openWindow, null, this);
        this.game.physics.arcade.overlap(this.player, this.drawer, openDrawer, null, this);

        this.fontStyle = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};   

        this.damianPerson = new Person("Damian Black", "damian");

        if (typeof this.bagText !== undefined && this.bagTaken === true) {
            this.bagText.destroy();
            this.bagTakeFText = false;
        }
        function takeBag(player, item) {
            if (this.fKey.isDown && this.bagTaken === false) {
                this.pickSound.play();
                this.bagTaken = true;
                this.game.textBox.addText(new Text("Damian hat seinen Rucksack genommen."));
                item.kill();
            } else if (this.bagTakeFText === false) {
                this.bagTakeFText = true;
                this.bagText = this.game.add.text(this.bag.x, this.bag.y, 'Drücke F: Nehmen', this.fontStyle);
            }
        }

        if (typeof this.doorText !== undefined && this.doorOpened === true) {
            this.doorText.destroy();
            this.doorOpenedFText = false;
        }
        function openDoor(player, item) {
            if (this.fKey.isDown && this.doorOpened === false) {
                this.doorUnlockSound.play();
                this.doorOpened = true;
                this.game.textBox.addText(new Text("Die Tür ist verschlossen."));
                this.game.textBox.addText(new Dialog("Mein Vater hat mich eingeschlossen? Ich muss einen anderen Ausgang finden...", this.damianPerson));
            } else if (this.doorOpenedFText === false) {
                this.doorOpenedFText = true;
                this.doorText = this.game.add.text(this.door.x, this.door.y, 'Drücke F: Öffnen', this.fontStyle);
            }
        }

    
        if (typeof this.drawerText !== undefined && this.drawerOpened === true) {
            this.drawerText.destroy();
            this.drawerOpenedFText = false;
        }
        function openDrawer(player, item) {
            if (this.amulet === false) {
                if (this.fKey.isDown && this.drawerOpened === false) {
                    this.drawerOpened = true;
                    let that = this;
                    window.noAmulet = function() {
                        that.drawerOpeningSound.play();
                        that.game.textBox.addText(new Text("Kein Amulett gefunden."));
                    }
                    window.foundAmulet = function() {
                        that.drawerOpeningSound.play();
                        that.amulet = true;
                        that.game.textBox.addText(new Text("Damian findet sein Amulett und legt es um seinen Hals."));

                        let x = that.player.x;
                        let y = that.player.y;
                        that.player.destroy();
                        that.player = createDamianAmulet(that.game, x, y);
                        that.facing = 'right'; //bugfix
                    }
                    this.game.textBox.addText(new Dialog("Hm, in welcher Schublade war nochmal das Amulett meines Onkels?", this.damianPerson));
                    let chooseDrawer = [
                        new Answer("Erste Schublade öffnen.", "noAmulet"),
                        new Answer("Zweite Schublade öffnen.", "noAmulet"),
                        new Answer("Dritte Schublade öffnen.", "foundAmulet")
                    ];
                    this.game.textBox.addText(new Decision(chooseDrawer));
                } else if (this.doorOpenedFText === false) {
                    this.drawerOpenedFText = true;
                    this.drawerText = this.game.add.text(this.drawer.x, this.drawer.y, 'Drücke F: Durchsuchen', this.fontStyle);
                }
            }
        }

        if (typeof this.windowText !== undefined && this.windowOpened === true) {
            this.windowText.destroy();
            this.windowOpenedFText = false;
            this.windowOpened = false; //mehrmals anklickbar, aber wird mehrfach ausgeführt
        }
        function openWindow(player, item) {
            if (this.fKey.isDown && this.windowOpened === false)  {
                this.windowOpened = true;
                let that = this;

                window.checkItem = function() {
                    if (that.bagTaken === true && that.amulet === true) {
                        that.escapeWayBackgroundSound.destroy();
                        that.state.start('FarmEscapeWay');
                        that.game.textBox.addText(new Text("Damian ist aus dem Fenster geklettert."));
                        that.game.textBox.addText(new Text("Jetzt muss er nur noch in das Luftschiff einsteigen."));
                    } else if (that.bagTaken === true && that.amulet === false){
                        that.game.textBox.addText(new Dialog("Ich muss noch mein Amulett finden.", that.damianPerson));
                    } else if (that.bagTaken === false && that.amulet === true){
                        that.game.textBox.addText(new Dialog("Ich muss noch meinen Rucksack mitnehmen.", that.damianPerson));
                    } else {
                        that.game.textBox.addText(new Dialog("Ich muss noch meinen Rucksack mitnehmen und mein Amulett finden.", that.damianPerson));
                    }
                }
                window.closeWindow = function() {
                    that.windowSound.play();
                    that.game.textBox.addText(new Text("Damian schließt das Fenster."));
                }
                let windowAnswers = [
                    new Answer("Aus dem Fenster klettern.", "checkItem"),
                    new Answer("Fenster schließen.", "closeWindow")
                ];

                this.windowSound.play();
                this.game.textBox.addText(new Text("Damian öffnet das Fenster."));
                this.game.textBox.addText(new Decision(windowAnswers));
            } else if (this.windowOpenedFText === false) {
                this.windowOpenedFText = true;
                this.windowText = this.game.add.text(this.window.x, this.window.y, 'Drücke F: Öffnen', this.fontStyle);
            }
        }

        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown || this.aKey.isDown) {
            this.player.body.velocity.x = -350;
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        } else if (this.cursors.right.isDown || this.dKey.isDown) {
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
                } else {
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