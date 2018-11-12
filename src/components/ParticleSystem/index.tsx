import * as React from 'react';
import * as PIXI from 'pixi.js';
import { TweenMax, TimelineMax } from 'gsap';
import * as Particles from 'pixi-particles';
import 'gsap/PixiPlugin';

import { trail, spark } from './emitters';

import * as styles from './styles.less';

class ParticleSystem extends React.Component {
  private app: PIXI.Application;
  private $canvas: HTMLCanvasElement;
  private currentMousePos: any = { x: -10, y: -10 };
  private trailEmitter: any;
  private sparkEmitter: any;

  private resizeTimeout: number | null;
  private fifteenFPS: number = 66;
  private particleContainer: PIXI.particles.ParticleContainer;

  constructor(props: any) {
    super(props);    

    window.addEventListener("resize", this.onThrottledResize, true);

    document.addEventListener("touchstart", this.onTouchStart, true);  
    document.addEventListener("touchmove", this.onTouchMove, true);
    document.addEventListener("touchend", this.onTouchEnd, true);  

    document.addEventListener("mousemove", this.onMouseMove, true);
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

    document.removeEventListener("mousemove", this.onMouseMove, true);
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

  private onMouseMove = ( event: MouseEvent) => {
    if(!this.trailEmitter.emit) {
      this.showTrail();
    }
    this.updateMousePos(event.pageX, event.pageY);
  }

  private updateMousePos = (x: number, y: number) => {
    this.currentMousePos.x = x;  
    this.currentMousePos.y = y;
  }

  private showTrail = (show: boolean = true) => {
    TweenMax.to(this.particleContainer, 0.5 , {pixi: {alpha: show ? 1 : 0}});
    this.trailEmitter.emit = show;
    this.sparkEmitter.emit = show;
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

    this.trailEmitter = new Particles.Emitter(
      this.particleContainer,
      [PIXI.Texture.fromImage('./assets/sprites/particle.png')],  
      trail
    );    

    this.sparkEmitter = new Particles.Emitter(
      this.particleContainer,
      [PIXI.Texture.fromImage('./assets/sprites/particle.png')],  
      spark
    );  

    this.app.stage.addChild(this.particleContainer);

    this.trailEmitter.emit = false;
    this.sparkEmitter.emit = false;

    const sharpness = 0.1;
    const minDelta = 0.05;
    const duration = 1;

    const emitterPos = { ...this.currentMousePos };
    this.trailEmitter.updateOwnerPos(emitterPos.x, emitterPos.y);
    this.sparkEmitter.updateOwnerPos(emitterPos.x, emitterPos.y);

    const colorOverLifeTime = new TimelineMax({ repeat: -1, yoyo: false });
    
    colorOverLifeTime
      .to(this.particleContainer, duration, { pixi: { tint: 0xE9F1DF } })
      .to(this.particleContainer, duration, { pixi: { tint: 0x4AD9D9 } });
    
    this.app.ticker.add((delta) => {    
      if (emitterPos.x !== this.currentMousePos.x || emitterPos.y !== this.currentMousePos.y) {
        const dt = 1 - Math.pow(1 - sharpness, delta); 
        const dx = this.currentMousePos.x - emitterPos.x;
        const dy = this.currentMousePos.y - emitterPos.y;
        
        if (Math.abs(dx) > minDelta) {
          emitterPos.x += dx * dt;
        } else {
          emitterPos.x = this.currentMousePos.x;
        }

        if (Math.abs(dy) > minDelta) {
          emitterPos.y += dy * dt;
        } else {
          emitterPos.y = this.currentMousePos.y;
        }    
        
        this.trailEmitter.updateOwnerPos(emitterPos.x, emitterPos.y);
        this.sparkEmitter.updateOwnerPos(emitterPos.x, emitterPos.y);
      }
    });
  }
}

export default ParticleSystem;
