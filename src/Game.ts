let gameLoopAnimId: number;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

const addEventListeners = (): void => {
  window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    // Handle touch start
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    // Handle touch move
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    e.preventDefault();
    // Handle touch end
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    // Handle key down
  });

  window.addEventListener('keyup', (e) => {
    // Handle key up
  });
} 

export const startGame = (): void => {
  canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // Ensure canvas size matches its displayed size to avoid distortion
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  addEventListeners();
  gameLoopAnimId = window.requestAnimationFrame(gameLoop);
}

const clearScreen = (): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawBackground = (elapsedTime: number): void => {
  // create a street background with moving lines
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 20;
  const lineHeight = 80;
  const gapHeight = 90;
  const totalHeight = lineHeight + gapHeight;
  const offset = (elapsedTime / 10) % totalHeight;

  for (let y = -totalHeight + offset; y < canvas.height; y += totalHeight) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, y);
    ctx.lineTo(canvas.width / 2 - 10, y + lineHeight);
    ctx.moveTo(canvas.width / 2 + 10, y);
    ctx.lineTo(canvas.width / 2 + 10, y + lineHeight);
    ctx.stroke();
  }
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