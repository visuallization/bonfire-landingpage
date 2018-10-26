import { GRADIENT } from '../constants';

export default function createGradientTexture(width: number, height: number, colors: string[], type?: GRADIENT, r1: number = 2, r2:number = 3) {
  const canvas = document.createElement('canvas');    
  canvas.width  = width;
  canvas.height = height;
  const ctx: any = canvas.getContext('2d');

  let gradient = ctx.createLinearGradient(0, 0, 0, height);

  if (type === GRADIENT.RADIAL) {
    gradient = ctx.createRadialGradient(width / 2, height / 2, width / r1, width / 2, height / 2, width / r2);
  }

  colors.forEach((color, i) => {
    gradient.addColorStop( i / (colors.length - 1), color);
  });

  ctx.fillStyle = gradient;    
  ctx.fillRect(0, 0, width, height);
  
  return PIXI.Texture.fromCanvas(canvas);
}