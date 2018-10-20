import * as React from 'react';
import * as PIXI from 'pixi.js';
import 'pixi-particles';

import { firefly } from './emitters';
import isMobile from '../../lib/isMobile';

import * as styles from './styles.less';

class ParticleSystem extends React.Component {
  private app: PIXI.Application;
  private $canvas: HTMLCanvasElement;
  private currentMousePos: any = { x: -10, y: -10 };
  private isMobile: boolean;
  private emitter: any;
  private resizeTimeout: number | null;
  private fifteenFPS: number = 66;

  constructor(props: any) {
    super(props);    

    this.isMobile = isMobile();

    window.addEventListener("resize", this.onThrottledResize)
    document.addEventListener("touchstart", this.onTouchStart, true);  
    document.addEventListener("touchmove", this.onTouchMove, true);
    document.addEventListener("touchend", this.onTouchEnd, true);  
  }

  public componentDidMount() {
    this.init();
    this.resize();
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.onThrottledResize)
    document.removeEventListener("touchstart", this.onTouchStart);  
    document.removeEventListener("touchmove", this.onTouchMove);
    document.removeEventListener("touchend", this.onTouchEnd);  
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
    this.updateMousePos(event);
  }
  
  private onTouchMove = (event: TouchEvent) => { 
    this.updateMousePos(event); 
  }
  
  private onTouchEnd = (event: TouchEvent) => {  
    this.updateMousePos(event);
  }

  private updateMousePos = (event: TouchEvent) => {
    this.currentMousePos.x = event.changedTouches[0].pageX;  
    this.currentMousePos.y = event.changedTouches[0].pageY;
  }

  private init = () => {
    this.app = new PIXI.Application(
      this.$canvas.offsetWidth,
      this.$canvas.offsetHeight,
      { view: this.$canvas, transparent: true, resolution: 1 }
    );

    this.app.renderer.autoResize = true;

    // @ts-ignore
    this.emitter = new PIXI.particles.Emitter(
      this.app.stage,
      [PIXI.Texture.fromImage('./assets/sprites/particle.png')],  
      firefly
    );

    this.emitter.emit = true;  

    this.app.ticker.add((delta) => {
      const mouseposition = this.isMobile ? this.currentMousePos : this.app.renderer.plugins.interaction.mouse.global;
      this.emitter.update(delta * 0.02);
      this.emitter.updateOwnerPos(mouseposition.x, mouseposition.y);
    });
  }
}

export default ParticleSystem;
