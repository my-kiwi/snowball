let gameLoopAnimId: number;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export const startGame = (): void => {
  canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // Ensure canvas size matches its displayed size to avoid distortion
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  gameLoopAnimId = window.requestAnimationFrame(gameLoop);
}

const clearScreen = (): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawBackground = (elapsedTime: number): void => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, `hsl(${(elapsedTime / 100) % 360}, 70%, 80%)`);
  gradient.addColorStop(1, `hsl(${(elapsedTime / 100 + 60) % 360}, 70%, 60%)`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const displayHud = (): void => {
  ctx.fillStyle = 'white';
  ctx.font = '18px Arial';
  ctx.fillText('Score: 0', 10, 20);
};

const displayHero = (elapsedTime: number): void => {
  const heroX = canvas.width / 2;
  const heroY = canvas.height / 2;
  const heroSize = 30 + 5 * Math.sin(elapsedTime / 200); // Simple animation
  // draw a simple square as the hero


  ctx.fillStyle = 'black';
  ctx.fillRect(heroX - heroSize / 2, heroY - heroSize / 2, heroSize, heroSize);
}

const gameLoop = (elapsedTime: number): void => {
  clearScreen();
  drawBackground(elapsedTime);
  displayHero(elapsedTime);
  displayHud();

  // For now, just loop
  gameLoopAnimId = window.requestAnimationFrame(gameLoop);

  ctx.fillStyle = 'white';
  ctx.font = '14px Arial';
  ctx.fillText(`Elapsed Time: ${Math.round(elapsedTime / 1000)} s`, canvas.width - 150, 20);
}