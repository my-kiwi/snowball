import { worldToCanvasSize, canvas, ctx } from "./canvas";
import { STREET_LAMP_RADIUS } from "./Game";
import { tileTypeToColor, TileChar, tileType } from "./levels";

export const drawBackground = (map: TileChar[][]): void => {
  const cellWidth = canvas.clientWidth / map[0].length;
  const cellHeight = canvas.clientHeight / map.length;

  // first draw the entire background as road
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // then draw each tile
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tile = map[row][col];
      drawTile(ctx, tile, col * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }
  }
};

export const drawCat = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  ctx.fillStyle = 'black';
  const size = worldToCanvasSize(70);
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
      // skip as already drawn by default
      break;
    case tileType.streetlamp:
      // skip as drawn separately
      break;
    case tileType.hero:
      // skip as drawn separately
      break;
    case tileType.enemy:
      // skip as drawn separately
      break;
    case tileType.exit:
      drawExit(ctx, x, y, width, height);
      break;
    case tileType.gap:
      drawGap(ctx, x, y, width, height);
      break;
    default:
      const color = tileTypeToColor[tile] || 'magenta';
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      break;
  }

}

export const drawEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  // draw ghost shape
  ctx.fillStyle = 'white';
  const size = worldToCanvasSize(60);
  // draw the head
  ctx.beginPath();
  ctx.arc(x, y - size * 0.1, size * 0.25, Math.PI, 0); // head

  // determine if we should display the second frame of the wavy bottom, for simple animation
  const shouldDisplaySecondFrame = Math.floor(Date.now() / 500) % 2 === 1;

  ctx.lineTo(x + size * 0.25, y + size * 0.25);
  // draw the wavy bottom
  const waveCount = 9;
  const waveWidth = (size * 0.5) / waveCount;
  for (let i = 0; i < waveCount; i++) {
    const waveX = x + size * 0.25 - i * waveWidth;
    const isDownPeak = (i % 2 === 0) === shouldDisplaySecondFrame;
    const waveY = y + size * 0.25 + (isDownPeak ? size * 0.05 : -size * 0.05);
    ctx.lineTo(waveX, waveY);
  }
  ctx.lineTo(x - size * 0.25, y + size * 0.25);
  ctx.closePath();
  ctx.fill();

  // draw eyes
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x - size * 0.07, y - size * 0.05, size * 0.05, 0, Math.PI * 2); // left eye
  ctx.arc(x + size * 0.07, y - size * 0.05, size * 0.05, 0, Math.PI * 2); // right eye
  ctx.fill();
}

const drawExit = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void => {
  // draw a simple door shape
  ctx.fillStyle = 'brown';
  ctx.fillRect(x + width * 0.2, y - height * 0.2, width * 0.6, height);
  // draw the door frame
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + width * 0.2, y - height * 0.2, width * 0.6, height);
  // draw the doorknob
  ctx.fillStyle = 'gold';
  ctx.beginPath();
  ctx.arc(x + width * 0.7, y + height / 3, width * 0.05, 0, Math.PI * 2);
  ctx.fill();
}

const drawGap = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void => {
  ctx.fillStyle = 'blue';
  ctx.fillRect(x, y, width, height);
}

export const drawStreetlamp = (x: number, y: number, isOn: boolean): void => {
  // draw the lamp as a lantern shape with light halo
  const lampHeight = worldToCanvasSize(60);
  const lampWidth = worldToCanvasSize(13);
  const haloRadius = worldToCanvasSize(STREET_LAMP_RADIUS);
  const frameColor = '#000';
  const lightColor = '#FFEA00';

  // draw the lantern that should look like a london streetlamp
  ctx.fillStyle = lightColor;
  ctx.beginPath();
  ctx.moveTo(x - lampWidth, y); // bottom left
  ctx.lineTo(x + lampWidth, y); // bottom right
  ctx.lineTo(x + lampWidth * 1.5, y - lampHeight * 0.6); // top right
  ctx.lineTo(x - lampWidth * 1.5, y - lampHeight * 0.6); // top left
  ctx.closePath();
  ctx.fill();

  // draw the light halo
  if (isOn) {
    const gradient = ctx.createRadialGradient(x, y - lampHeight / 2, lampWidth * 0.5, x, y, haloRadius);
    gradient.addColorStop(0, 'rgba(255, 234, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 234, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // draw the pole
  ctx.fillStyle = frameColor;
  ctx.fillRect(x - lampWidth / 2, y, lampWidth, lampHeight / 2);

  // draw lantern frame
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - lampWidth, y); // bottom left
  ctx.lineTo(x + lampWidth, y); // bottom right
  ctx.lineTo(x + lampWidth * 1.5, y - lampHeight * 0.6); // top right
  ctx.lineTo(x - lampWidth * 1.5, y - lampHeight * 0.6); // top left
  ctx.closePath();
  ctx.stroke();

  // draw the "hat" of the lantern
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(x - lampWidth * 1.5, y - lampHeight * 0.6); // top left
  ctx.lineTo(x + lampWidth * 1.5, y - lampHeight * 0.6); // top right
  ctx.lineTo(x + lampWidth * 1.2, y - lampHeight * 0.8); // peak right
  ctx.lineTo(x - lampWidth * 1.2, y - lampHeight * 0.8); // peak left
  ctx.closePath();
  ctx.fill();

  // vertical lines
  ctx.beginPath();
  ctx.moveTo(x - lampWidth / 2, y); // bottom center left
  ctx.lineTo(x - lampWidth / 2, y - lampHeight * 0.6); // top center left
  ctx.moveTo(x + lampWidth / 2, y); // bottom center right
  ctx.lineTo(x + lampWidth / 2, y - lampHeight * 0.6); // top center right
  ctx.stroke();


  // draw the pole base
  ctx.fillStyle = frameColor;
  ctx.fillRect(x - lampWidth, y + lampHeight / 2, lampWidth * 2, lampWidth);

  // // draw some light rays
  // ctx.strokeStyle = 'rgba(255, 234, 0, 0.3)';
  // ctx.lineWidth = 2;
  // for (let angle = Math.PI / 4; angle < Math.PI * 2; angle += Math.PI / 2) {
  //   ctx.beginPath();
  //   ctx.moveTo(x, y);
  //   ctx.lineTo(x + Math.cos(angle) * haloRadius, y + Math.sin(angle) * haloRadius);
  //   ctx.stroke();
  // }
}