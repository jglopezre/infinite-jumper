import Phaser from 'phaser';
import background from '../assets/bg_layer1.png';
import platform from '../assets/ground_grass.png';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', background);
    this.load.image('platform', platform);

  }

  create() {
    this.add.image(240, 320, 'background');
    this.physics.add.image(240, 320, 'platform').setScale(0.5);
  }
}