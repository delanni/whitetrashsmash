var createPhaserGame = function (callback) {
    var phaserGame = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer', {
        preload: preload,
        create: create
    });

    function preload() {
        // Peter Wifebeater
        phaserGame.load.spritesheet('redneck_idle_1', '/texture/redneck_idle_1.png', 64, 64);
        phaserGame.load.spritesheet('redneck_idle_2', '/texture/redneck_idle_2.png', 64, 64);
        phaserGame.load.spritesheet('redneck_idle_3', '/texture/redneck_idle_3.png', 64, 64);
        phaserGame.load.spritesheet('redneck_attack_1', '/texture/redneck_attack_1.png', 64, 64);
        phaserGame.load.spritesheet('redneck_attack_2', '/texture/redneck_attack_2.png', 64, 64);
        phaserGame.load.spritesheet('redneck_attack_3', '/texture/redneck_attack_3.png', 64, 64);
        phaserGame.load.spritesheet('redneck_block_1', '/texture/redneck_block_1.png', 64, 64);
        phaserGame.load.spritesheet('redneck_block_2', '/texture/redneck_block_2.png', 64, 64);
        phaserGame.load.spritesheet('redneck_block_3', '/texture/redneck_block_3.png', 64, 64);
        //    game.load.spritesheet('redneck_hit_1', '/texture/redneck_hit_1.png', 64, 64);
        //    game.load.spritesheet('redneck_hit_2', '/texture/redneck_hit_2.png', 64, 64);
        //    game.load.spritesheet('redneck_hit_3', '/texture/redneck_hit_3.png', 64, 64);

        // Greg McKeg
        phaserGame.load.spritesheet('notbaldman_idle_1', '/texture/notbaldman_idle_1.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_idle_2', '/texture/notbaldman_idle_2.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_idle_3', '/texture/notbaldman_idle_3.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_attack_1', '/texture/notbaldman_attack_1.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_attack_2', '/texture/notbaldman_attack_2.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_attack_3', '/texture/notbaldman_attack_3.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_block_1', '/texture/notbaldman_block_1.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_block_2', '/texture/notbaldman_block_2.png', 64, 64);
        phaserGame.load.spritesheet('notbaldman_block_3', '/texture/notbaldman_block_3.png', 64, 64);
        //    game.load.spritesheet('notbaldman_hit_1', '/texture/notbaldman_hit_1.png', 64, 64);
        //    game.load.spritesheet('notbaldman_hit_2', '/texture/notbaldman_hit_2.png', 64, 64);
        //    game.load.spritesheet('notbaldman_hit_3', '/texture/notbaldman_hit_3.png', 64, 64);

        phaserGame.load.spritesheet('smoke', '/texture/smoke.png', 32, 32);
        phaserGame.load.image("background", "/texture/background.png");
    }

    function create() {

        phaserGame.add.tileSprite(0, 0, 800, 600, 'background');
        var smoke = phaserGame.add.sprite(255, 260, 'smoke');

        smoke.animations.add('smoke', [0, 1, 2, 3, 4]);
        smoke.animations.play('smoke', 2, true);
        smoke.scale.set(0.5);
        smoke.smoothed = false;

        var blokeProto = {
            health: 3,
            init: function () {
                var ptr = this;
            [1, 2, 3].forEach(function (health) {
                ["idle", "attack", "block"].forEach(function (animName) {
                        var spr = ptr.getSprite(health, animName);
                        spr.smoothed = false;
                        spr.scale.set(5,5);
                        spr.anchor.setTo(.5, .5);
                        spr.animations.add(animName, range(animName == "idle" ? 5 : 3));
                    });
                });

                this.allSprite(function (e) {
                    e.visible = false;
                });
            },

            setPosition: function (x, y) {
                this.allSprite(function (sprite) {
                    sprite.position.set(x, y);
                })
            },

            flip: function () {
                this.allSprite(function (sprite) {
                    sprite.scale.set(-5, 5);
                });
            },

            allSprite: function (callback) {
                Object.keys(this.sprites).forEach(function (key) {
                    callback.call(this, this.sprites[key]);
                }, this);
            },

            getSprite: function (health, animName) {
                return this.sprites[animName + "_" + (4 - health)];
            },

            getAnim: function (health, animName) {
                var s = this.getSprite(health, animName);
                var props = this.animProps[animName + "_" + (4 - health)];
                return s.animations.play(animName, props[0], props[1]);
            },

            playAnim: function (name) {
                if (this._anim) {
                    this._anim.stop();
                    this._anim._parent.visible = false;
                }
                //            this.allSprite(function(e){
                //               e.animations.stop();
                //            });
                this._anim = this.getAnim(this.health, name);
                this._anim._parent.visible = true;
            }
        };

        var peter = phaserGame.peter = Object.create(blokeProto);
        peter.sprites = {
            idle_1: phaserGame.add.sprite(0, 0, "redneck_idle_1"),
            idle_2: phaserGame.add.sprite(0, 0, "redneck_idle_2"),
            idle_3: phaserGame.add.sprite(0, 0, "redneck_idle_3"),
            attack_1: phaserGame.add.sprite(0, 0, "redneck_attack_1"),
            attack_2: phaserGame.add.sprite(0, 0, "redneck_attack_2"),
            attack_3: phaserGame.add.sprite(0, 0, "redneck_attack_3"),
            block_1: phaserGame.add.sprite(0, 0, "redneck_block_1"),
            block_2: phaserGame.add.sprite(0, 0, "redneck_block_2"),
            block_3: phaserGame.add.sprite(0, 0, "redneck_block_3")
        };
        peter.animProps = {
            idle_1: [15, true],
            idle_2: [13, true],
            idle_3: [11, true],
            attack_1: [18, false],
            attack_2: [14, false],
            attack_3: [12, false],
            block_1: [12, false],
            block_2: [12, false],
            block_3: [12, false]
        }

        var greg = phaserGame.greg = Object.create(blokeProto);
        greg.sprites = {
            idle_1: phaserGame.add.sprite(0, 0, "notbaldman_idle_1"),
            idle_2: phaserGame.add.sprite(0, 0, "notbaldman_idle_2"),
            idle_3: phaserGame.add.sprite(0, 0, "notbaldman_idle_3"),
            attack_1: phaserGame.add.sprite(0, 0, "notbaldman_attack_1"),
            attack_2: phaserGame.add.sprite(0, 0, "notbaldman_attack_2"),
            attack_3: phaserGame.add.sprite(0, 0, "notbaldman_attack_3"),
            block_1: phaserGame.add.sprite(0, 0, "notbaldman_block_1"),
            block_2: phaserGame.add.sprite(0, 0, "notbaldman_block_2"),
            block_3: phaserGame.add.sprite(0, 0, "notbaldman_block_3")
        };
        greg.animProps = {
            idle_1: [16, true],
            idle_2: [14, true],
            idle_3: [12, true],
            attack_1: [18, false],
            attack_2: [18, false],
            attack_3: [18, false],
            block_1: [12, false],
            block_2: [12, false],
            block_3: [12, false]
        };

        function range(min, max) {
            if (typeof max == 'undefined') {
                max = min;
                min = 0;
            }
            var t = [];
            for (var i = min; i < max; i++) {
                t.push(i);
            }
            return t;
        }

        function startGame() {

            var p = Math.random() > 0.5 ? [peter, greg] : [greg, peter];
            var p1 = p[0];
            var p2 = p[1];

            peter.init();
            greg.init();

            p1.setPosition(350,360);
            p2.setPosition(470,350);

            p2.flip();

            p1.playAnim("idle");
            p2.playAnim("idle");

            window.p1 = p1;
            window.p2 = p2;
            return [p1, p2];
        };

        callback([phaserGame, startGame]);
    }
}