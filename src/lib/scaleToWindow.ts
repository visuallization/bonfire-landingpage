import isMobile from './isMobile';

export default function scaleToWindow(element: HTMLElement) {
  const screenWidth = isMobile() ? screen.width : window.innerWidth;
  const screenHeight = isMobile() ? screen.height : window.innerHeight;

  const scaleX = screenWidth / element.offsetWidth;
  const scaleY = screenHeight / element.offsetHeight;

  const scale = Math.min(scaleX, scaleY);

  return scale;
}