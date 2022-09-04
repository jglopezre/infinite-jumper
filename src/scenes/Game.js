import Phaser from 'phaser';
import background from '../assets/bg_layer1.png';
import platform from '../assets/ground_grass.png';
import bunnyStand from '../assets/bunny1_stand.png';


export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors

  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', background);
    this.load.image('platform', platform);
    this.load.image('bunny-stand', bunnyStand);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(240, 320, 'background').setScrollFactor(1, 0);

    this.platforms = this.physics.add.staticGroup();
    
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, 'platform');
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    };

    this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.3);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    this.physics.add.collider(this.platforms, this.player);

    this.cameras.main.startFollow(this.player );

  }

  update() {
    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;

      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
      }
    })

    const touchingDown = this.player.body.touching.down;
    touchingDown ? this.player.setVelocityY(-300) : null;
  }
}