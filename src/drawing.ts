import { tileTypeToColor, TileChar, tileType } from "./levels";

export const drawCat = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  ctx.fillStyle = 'black';
  const size = 50;
  // draw a simple cat shape, first the head
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2); // head
  ctx.fill();
  // draw the ears
  // left
  ctx.beginPath();
  ctx.moveTo(x - size * 0.3, y - size * 0.1); // top of left ear
  ctx.lineTo(x - size * 0.3, y - size * 0.4); // left tip of left ear
  ctx.lineTo(x - size * 0.1, y - size * 0.3); // right tip of left ear
  ctx.closePath();
  ctx.fill();
  // right
  ctx.beginPath();
  ctx.moveTo(x + size * 0.3, y - size * 0.1);
  ctx.lineTo(x + size * 0.3, y - size * 0.4);
  ctx.lineTo(x + size * 0.1, y - size * 0.3);
  ctx.closePath();
  ctx.fill();
  // draw the eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x - size * 0.1, y - size * 0.05, size * 0.05, 0, Math.PI * 2); // left eye
  ctx.arc(x + size * 0.1, y - size * 0.05, size * 0.05, 0, Math.PI * 2); // right eye
  ctx.fill();
  // draw the pupils
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x - size * 0.1, y - size * 0.05, size * 0.02, 0, Math.PI * 2); // left pupil
  ctx.arc(x + size * 0.1, y - size * 0.05, size * 0.02, 0, Math.PI * 2); // right pupil
  ctx.fill();
  // draw the nose
  ctx.fillStyle = 'pink';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size * 0.03, y + size * 0.05);
  ctx.lineTo(x + size * 0.03, y + size * 0.05);
  ctx.closePath();
  ctx.fill();
};

export const drawTile = (ctx: CanvasRenderingContext2D, tile: TileChar, x: number, y: number, width: number, height: number): void => {
  // draw specific tile types
  switch (tile) {
    case tileType.wall:
      ctx.fillStyle = tileTypeToColor[tileType.wall];
      ctx.fillRect(x, y, width, height);
      break;
    case tileType.road:
      // already drawn as background
      break;
    case tileType.streetlamp:
      drawStreetlamp(ctx, x + width / 2, y + height / 2);
      break;
    case tileType.hero:
      drawCat(ctx, x + width / 2, y + height / 2);
      break;
    case tileType.enemy:
      ctx.fillStyle = tileTypeToColor[tileType.enemy];
      ctx.fillRect(x + width * 0.2, y + height * 0.2, width * 0.6, height * 0.6);
      break;
    case tileType.exit:
      ctx.fillStyle = tileTypeToColor[tileType.exit];
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + height * 0.2);
      ctx.lineTo(x + width * 0.8, y + height * 0.8);
      ctx.lineTo(x + width * 0.2, y + height * 0.8);
      ctx.closePath();
      ctx.fill();
      break;
    default:
      // Unknown tile type
      ctx.fillStyle = 'magenta';
      ctx.fillRect(x, y, width, height);
      break;
  }
      
}

const drawStreetlamp = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  // draw the lamp as a lantern shape with light halo
  const lampHeight = 40;
  const lampWidth = 10;
  const haloRadius = 30;

  // draw the pole
  ctx.fillStyle = '#555';
  ctx.fillRect(x - lampWidth / 2, y, lampWidth, lampHeight);

  // draw the lantern
  ctx.fillStyle = '#FFEA00';
  ctx.beginPath();
  ctx.ellipse(x, y, lampWidth * 1.5, lampHeight * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // draw the light halo
  const gradient = ctx.createRadialGradient(x, y, lampWidth * 0.5, x, y, haloRadius);
  gradient.addColorStop(0, 'rgba(255, 234, 0, 0.6)');
  gradient.addColorStop(1, 'rgba(255, 234, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
  ctx.fill();
}