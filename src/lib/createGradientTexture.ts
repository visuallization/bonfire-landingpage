export default function createGradientTexture(width: number, height: number, colors: string[]) {
  const canvas = document.createElement('canvas');    
  canvas.width  = width;
  canvas.height = height;
  const ctx: any = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  colors.forEach((color, i) => {
    gradient.addColorStop( i / (colors.length - 1), color);
  });
  ctx.fillStyle = gradient;    
  ctx.fillRect(0, 0, width, height);
  return PIXI.Texture.fromCanvas(canvas);
}