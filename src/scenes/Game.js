import Phaser from 'phaser';
import Carrot from '../game/Carrot';
import background from '../assets/bg_layer1.png';
import platform from '../assets/ground_grass.png';
import bunnyStand from '../assets/bunny1_stand.png';
import carrot from '../assets/carrot.png';

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors
  /** @type {Phaser.Physics.Arcade.Group} */
  carrots

  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', background);
    this.load.image('platform', platform);
    this.load.image('bunny-stand', bunnyStand);
    this.load.image('carrot', carrot);

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

    this.carrots = this.physics.add.group ({
      classType: Carrot
    });
    
    this.physics.add.collider(this.platforms, this.carrots);

    this.cameras.main.startFollow(this.player );
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

  }

  update(t, dt) {
    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;

      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
        this.addCarrotAbove(platform);
      }
    })

    const touchingDown = this.player.body.touching.down;
    touchingDown ? this.player.setVelocityY(-300) : null;
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);
  }
  /**
   *  @type {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width
    if(sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if(sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    };
  }

  /**
   * @type {Phaser.Physics.Arcade.Sprite} sprite 
   */
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot');
    this.add.existing(carrot);

    carrot.body.setSize(carrot.width, carrot.height);
    return carrot;
  }
}