let gameLoopAnimId: number;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export const startGame = (): void => {
  canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // Ensure canvas size matches its displayed size to avoid distortion
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  gameLoopAnimId = requestAnimationFrame(gameLoop);
}

const gameLoop = (elapsedTime: number): void => {
  // Game logic and rendering would go here
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '14px Arial';
  ctx.fillText(`Elapsed Time: ${elapsedTime} ms`, canvas.width - 180, 10);


  // For now, just loop
  gameLoopAnimId = requestAnimationFrame(gameLoop);
}