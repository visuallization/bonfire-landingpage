import * as React from 'react';
import * as PIXI from 'pixi.js';
import { TweenMax } from 'gsap';
import * as Particles from 'pixi-particles';
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
    this.showTrail();
    this.updateMousePos(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
  }
  
  private onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    // get offset top for latest IOS Safari to set mouse position correctly
    this.updateMousePos(event.changedTouches[0].pageX, event.changedTouches[0].pageY + this.$canvas.getBoundingClientRect().top); 
  }
  
  private onTouchEnd = (event: TouchEvent) => {
    this.showTrail(false);
  }

  private onMouseDown = ( event: MouseEvent) => {
    this.showTrail();
    this.updateMousePos(event.pageX, event.pageY);
  }

  private onMouseMove = ( event: MouseEvent) => {
    this.updateMousePos(event.pageX, event.pageY);
  }

  private onMouseUp = ( event: MouseEvent) => {
    this.showTrail(false);
  }

  private updateMousePos = (x: number, y: number) => {
    this.currentMousePos.x = x;  
    this.currentMousePos.y = y;
  }

  private showTrail = (show: boolean = true) => {
    TweenMax.to(this.particleContainer, 0.5 , {pixi: {alpha: show ? 1 : 0}});
    this.emitter.emit = show;
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

    this.emitter = new Particles.Emitter(
      this.particleContainer,
      [PIXI.Texture.fromImage('./assets/sprites/particle.png')],  
      trail
    );

    this.app.stage.addChild(this.particleContainer);

    this.emitter.emit = false;
    
    this.app.ticker.add((delta) => {      
      this.emitter.updateOwnerPos(this.currentMousePos.x, this.currentMousePos.y);
    });
  }
}

export default ParticleSystem;
