import * as React from 'react';
import * as PIXI from 'pixi.js';
import { TweenMax } from 'gsap';
import 'pixi-particles';
import 'gsap/PixiPlugin';

import { trail } from './emitters';

import * as styles from './styles.less';

class ParticleSystem extends React.Component {
  private app: PIXI.Application;
  private $canvas: HTMLCanvasElement;
  private currentMousePos: any = { x: -10, y: -10 };
  private emitter: any;
  private resizeTimeout: number | null;
  private fifteenFPS: number = 66;
  private particleContainer: PIXI.particles.ParticleContainer;

  constructor(props: any) {
    super(props);    

    window.addEventListener("resize", this.onThrottledResize, true);

    document.addEventListener("touchstart", this.onTouchStart, true);  
    document.addEventListener("touchmove", this.onTouchMove, true);
    document.addEventListener("touchend", this.onTouchEnd, true);  

    document.addEventListener("mousedown", this.onMouseDown, true);  
    document.addEventListener("mousemove", this.onMouseMove, true);
    document.addEventListener("mouseup", this.onMouseUp, true);  
  }

  public componentDidMount() {
    this.init();
    this.resize();
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.onThrottledResize);

    document.removeEventListener("touchstart", this.onTouchStart, true);  
    document.removeEventListener("touchmove", this.onTouchMove, true);
    document.removeEventListener("touchend", this.onTouchEnd,true);  

    document.removeEventListener("mousedown", this.onMouseDown, true);  
    document.removeEventListener("mousemove", this.onMouseMove, true);
    document.removeEventListener("mouseup", this.onMouseUp, true);  
  }

  public render() {
    return(
      <canvas className={styles.canvas} ref={(canvas: HTMLCanvasElement) => { this.$canvas = canvas; }} />
    );
  }

  private onThrottledResize = () => {
    if(!this.resizeTimeout) {
      this.resizeTimeout = window.setTimeout(() => {
        this.resizeTimeout = null;
        this.resize();
      }, this.fifteenFPS);
    }
  }

  private resize = () => {    
    this.$canvas.width = window.innerWidth;
    this.$canvas.height = window.innerHeight;
    this.app.renderer.resize(this.$canvas.width, this.$canvas.height)
  }

  private onTouchStart = (event: TouchEvent) => { 
    TweenMax.to(this.particleContainer, 0.5 , {pixi: {alpha: 1}});
    this.updateMousePos(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
  }
  
  private onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    this.updateMousePos(event.changedTouches[0].pageX, event.changedTouches[0].pageY); 
  }
  
  private onTouchEnd = (event: TouchEvent) => {
    TweenMax.to(this.particleContainer, 0.5 , {pixi: {alpha: 0}});
    this.updateMousePos(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
  }

  private onMouseDown = ( event: MouseEvent) => {
    TweenMax.to(this.particleContainer, 0.5 , {pixi: {alpha: 1}});
    this.updateMousePos(event.pageX, event.pageY);
  }

  private onMouseMove = ( event: MouseEvent) => {
    this.updateMousePos(event.pageX, event.pageY);
  }

  private onMouseUp = ( event: MouseEvent) => {
    TweenMax.to(this.particleContainer, 0.5 , {pixi: {alpha: 0}});
    this.updateMousePos(event.pageX, event.pageY);
  }

  private updateMousePos = (x: number, y: number) => {
    this.currentMousePos.x = x;  
    this.currentMousePos.y = y;
  }

  private init = () => {
    
    this.app = new PIXI.Application(
      this.$canvas.offsetWidth,
      this.$canvas.offsetHeight,
      { view: this.$canvas, transparent: true, resolution: window.devicePixelRatio || 1 }
    );

    this.app.renderer.autoResize = true;

    this.particleContainer = new PIXI.particles.ParticleContainer(5000, {
      scale: true,
      position: true,
      rotation: false,
      uvs: false,
      tint: true
    });

    this.particleContainer.alpha = 0;

    // @ts-ignore
    this.emitter = new PIXI.particles.Emitter(
      this.particleContainer,
      [PIXI.Texture.fromImage('./assets/sprites/particle.png')],  
      trail
    );

    this.app.stage.addChild(this.particleContainer);
    this.emitter.emit = true;  
    
    this.app.ticker.add((delta) => {
      this.emitter.updateOwnerPos(this.currentMousePos.x, this.currentMousePos.y);
    });
  }
}

export default ParticleSystem;
