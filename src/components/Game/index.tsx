import * as React from 'react';
import * as PIXI from 'pixi.js';
import { TimelineMax } from 'gsap';
import 'gsap/PixiPlugin';

import { createGradientTexture, scaleToWindow } from '../../lib';
import { GRADIENT } from '../../constants';


import * as styles from './styles.less';

interface IGameProps {
  onLoaded(): void;
}

interface IGameState {
  scale: number;
}

class Game extends React.Component<IGameProps, IGameState> {
  public static defaultProps: IGameProps = {
    onLoaded: () => { console.log("Loading has finished."); }
  }

  private app: PIXI.Application;
  private $canvas: HTMLCanvasElement;

  constructor(props: any) {
    super(props);

    this.state = {
      scale: 1
    };
  }

  public componentDidMount() {
    this.init();

    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  public render() {
    const { scale } = this.state;
    
    return (
      <canvas
        className={styles.canvas}
        style={{transform: `scale(${scale}) translate(-50%, -100%)`}}
        ref={(canvas: HTMLCanvasElement) => {
          this.$canvas = canvas;
        }}
      />
    );
  }

  private onResize = () => {
    this.setState({scale: scaleToWindow(this.app.renderer.view)});
  };

  private init = () => {
    this.app = new PIXI.Application(
      this.$canvas.offsetWidth,
      this.$canvas.offsetHeight,
      { view: this.$canvas, backgroundColor: 0x294167, resolution: 1 }
    );
    this.app.renderer.autoResize = true;
    scaleToWindow(this.app.renderer.view);

    PIXI.loader
      .add('background', './assets/sprites/background.png')
      .add('fire', './assets/sprites/fire.json')
      .add('indians', './assets/sprites/indians.json')
      .on('progress', this.showLoadingProgress)
      .load(this.setupGameScene);
  };

  private showLoadingProgress = (
    loader: PIXI.loaders.Loader,
    resource: any
  ) => {
    if (resource.error) {
      console.error(resource.error);
    } else {
      console.log('loading: ', resource.name);
      console.log('progress: ', loader.progress + '%');
    }
  };

  private setupGameScene = (loader: PIXI.loaders.Loader, resources: any) => {
    const { onLoaded } = this.props;
    const scene = {
      width: this.app.renderer.width,
      height: this.app.renderer.height
    };

    const gradient = new PIXI.Sprite(
      createGradientTexture(scene.width, scene.height / 2, [
        '#000000',
        '#294167'
      ])
    );

    const vignette = new PIXI.Sprite(
      createGradientTexture(scene.width, scene.height, [
        'rgba(0,0,0,1)',
        'rgba(0,0,0,0)'
      ], GRADIENT.RADIAL)
    );

    const glow = new PIXI.Sprite(
      createGradientTexture(256, 256, [
        'rgba(0,0,0,1)',
        'rgba(255,255,255,1)'
      ], GRADIENT.RADIAL, 2, 20)
    );

    glow.position.set(0, scene.height);
    glow.anchor.set(0, 1);
    glow.scale.set(8.5, 4.4);
    glow.tint = 0xf20505;
    glow.alpha = 0.4;
    glow.blendMode = PIXI.BLEND_MODES.ADD;

    vignette.anchor.set(0.5, 0.5);
    vignette.position.set(scene.width / 2, (scene.height / 2) * 2.5);
    vignette.scale.set(1.2, 4);

    const background = new PIXI.Sprite(resources.background.texture);

    const leftIndian = this.setupLeftIndian(resources.indians.textures);
    const rightIndian = this.setupRightIndian(resources.indians.textures);
    
    background.position.set(0, scene.height);
    background.anchor.set(0, 1);

    
    const fire = this.setupFire(resources.fire.textures);

    this.app.stage.addChild(gradient);
    this.app.stage.addChild(background);
    this.app.stage.addChild(leftIndian);
    this.app.stage.addChild(rightIndian);
    this.app.stage.addChild(vignette);
    this.app.stage.addChild(fire);
    this.app.stage.addChild(glow);

    onLoaded();
  };

  private setupFire = (spriteSheet: PIXI.Texture) => {
    const fireFrames = Object.keys(spriteSheet).map(
      t => spriteSheet[t]
    );
    const fire = new PIXI.extras.AnimatedSprite(fireFrames);

    fire.position.set(this.app.renderer.width / 2 + 300, this.app.renderer.height / 2 + 680);
    fire.anchor.set(0.5, 0.5);
    fire.scale.set(2, 1.5);
    fire.alpha = 0.8;
    fire.blendMode = PIXI.BLEND_MODES.ADD;
    fire.animationSpeed = 0.2;
    fire.play();

    return fire;
  }

  private setupLeftIndian = (spriteSheet: PIXI.Texture) => {
    const leftIndian = new PIXI.Container();
    const leftIndianHeadContainer = new PIXI.Container();

    const leftIndianBody = new PIXI.Sprite(
      spriteSheet['indian_01_body.png']
    );
    const leftIndianFeather = new PIXI.Sprite(
      spriteSheet['indian_01_feather.png']
    );
    const leftIndianHead = new PIXI.Sprite(
      spriteSheet['indian_01_head.png']
    );

    leftIndianFeather.position.set(50, -20);
    leftIndianHead.position.set(140, 10);
    leftIndianHead.anchor.set(0.5, 1);
    leftIndianHeadContainer.addChild(leftIndianHead);
    leftIndianHeadContainer.addChild(leftIndianFeather);

    leftIndianHeadContainer.position.set(125, 20);
    leftIndianHeadContainer.pivot.set(
      leftIndianHeadContainer.width / 2 + leftIndianHead.width / 2,
      0
    );
    leftIndian.addChild(leftIndianBody);
    leftIndian.addChild(leftIndianHeadContainer);

    const leftIndianTimeline = new TimelineMax({ repeat: -1, repeatDelay: 6 });
    leftIndianTimeline
      .to(leftIndianHeadContainer, 1, { pixi: { rotation: -5 } })
      .to(leftIndianHeadContainer, 2, { pixi: { rotation: 15 } })
      .to(leftIndianHeadContainer, 2, { pixi: { rotation: 0 } });


    leftIndian.position.set(this.app.renderer.width / 2 - 400, this.app.renderer.height / 2 + 500);
    leftIndian.scale.set(1.5, 1.5);

    return leftIndian;
  }

  private setupRightIndian = (spriteSheet: PIXI.Texture) => {
    const rightIndian = new PIXI.Container();
    const rightIndianHeadContainer = new PIXI.Container();
    const rightIndianBody = new PIXI.Sprite(
      spriteSheet['indian_02_body.png']
    );
    const rightIndianFeather = new PIXI.Sprite(
      spriteSheet['indian_02_feather.png']
    );
    const rightIndianHead = new PIXI.Sprite(
      spriteSheet['indian_02_head.png']
    );
    const rightIndianArmLeft = new PIXI.Sprite(
      spriteSheet['indian_02_arm_left.png']
    );
    const rightIndianArmRight = new PIXI.Sprite(
      spriteSheet['indian_02_arm_right.png']
    );

    rightIndianFeather.position.set(130, -30);
    rightIndianHead.position.set(80, -30);
    rightIndianArmRight.position.set(60, 120);
    rightIndianArmLeft.anchor.set(1, 1);
    rightIndianArmLeft.position.set(230, 200);

    rightIndianHeadContainer.addChild(rightIndianFeather);
    rightIndianHeadContainer.addChild(rightIndianHead);

    rightIndianHeadContainer.position.set(120, 60);
    rightIndianHeadContainer.pivot.set(
      rightIndianHeadContainer.width / 2 + rightIndianHead.width / 2,
      rightIndianHeadContainer.height / 2
    );

    rightIndian.addChild(rightIndianBody);
    rightIndian.addChild(rightIndianHeadContainer);
    rightIndian.addChild(rightIndianArmRight);
    rightIndian.addChild(rightIndianArmLeft);

    const rightIndianTimeline = new TimelineMax({
      repeat: -1,
      repeatDelay: 5,
      delay: 5
    });
    rightIndianTimeline
      .to(rightIndianHeadContainer, 2, { pixi: { rotation: -10 } })
      .to(rightIndianHeadContainer, 2, { pixi: { rotation: 5 } })
      .to(rightIndianHeadContainer, 2, { pixi: { rotation: 0 } });

    const rightIndianArmTimeline = new TimelineMax({
      repeat: -1,
      repeatDelay: 7,
      delay: 5
    });
    rightIndianArmTimeline
      .to(rightIndianArmLeft, 2, { pixi: { rotation: 10 } })
      .to(rightIndianArmLeft, 2, { pixi: { rotation: 0 } });

    rightIndian.position.set(this.app.renderer.width / 2 + 300,this.app.renderer.height / 2 + 360);
    rightIndian.scale.set(1.5, 1.5);

    return rightIndian;
  }
}

export default Game;
