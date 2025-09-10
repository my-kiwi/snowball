import { drawCat, drawTile } from './drawing';
import { levels, tileType, tileTypeToColor } from './levels';
const isDebugMap = true

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

const state = {
  bg: {
    x: 0,
    y: 0,
    speed: 2,
  },
  hero: {
    x: 100,
    y: 100,
    size: 30,
    speed: 5,
    mapPosition: { x: 0, y: 0 }
  },
  level: {
    current: 0,
    map: levels[0].map
  }
};

const onTileClick = (x: number, y: number): void => {
  state.hero.x = x;
  state.hero.y = y;
  // check which tile was touched and change its type when in debug mode
  if (isDebugMap) {
    const cellWidth = canvas.width / state.level.map[0].length;
    const cellHeight = canvas.height / state.level.map.length;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    if (row >= 0 && row < state.level.map.length && col >= 0 && col < state.level.map[0].length) {
      // rotate between different tile types
      // FIXME state.level.map[row][col] = (state.level.map[row][col] + 1) % Object.keys(tileType).length;
    }
  }
}

const addEventListeners = (): void => {
  window.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    // Handle touch start
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    onTileClick(x, y);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    // Handle touch move
    state.hero.x = e.touches[0].clientX;
    state.hero.y = e.touches[0].clientY;
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    e.preventDefault();
    // Handle touch end
    state.hero.x = e.changedTouches[0].clientX;
    state.hero.y = e.changedTouches[0].clientY;
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    // Handle key down
    switch (e.key) {
      case 'ArrowUp':
        state.hero.y -= state.hero.speed;
        break;
      case 'ArrowDown':
        state.hero.y += state.hero.speed;
        break;
      case 'ArrowLeft':
        state.hero.x -= state.hero.speed;
        break;
      case 'ArrowRight':
        state.hero.x += state.hero.speed;
        break;
    }
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

  // Handle high-DPI displays
  const dpr = /*window.devicePixelRatio || */ 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);

  // Game setup
  addEventListeners();
  setHeroStartingPosition();

  // Start the game loop
  window.requestAnimationFrame(gameLoop);
}

const setHeroStartingPosition = (): void => {
  // set hero at the tile marked as 'H' in the level map
  for (let row = 0; row < state.level.map.length; row++) {
    for (let col = 0; col < state.level.map[row].length; col++) {
      if (state.level.map[row][col] === tileType.hero) {
        const cellWidth = canvas.width / state.level.map[0].length;
        const cellHeight = canvas.height / state.level.map.length;
        state.hero.x = col * cellWidth + cellWidth / 2;
        state.hero.y = row * cellHeight + cellHeight / 2;
        return;
      }
    }
  }
}

const clearScreen = (): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const getCurrentLevelMatrix = () => {
  return state.level.map;
}

const drawBackground = (elapsedTime: number): void => {
  const matrixToDraw = getCurrentLevelMatrix();
  const cellWidth = canvas.width / matrixToDraw[0].length;
  const cellHeight = canvas.height / matrixToDraw.length;

  // first draw the entire background as road
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // then draw each tile
  
  for (let row = 0; row < matrixToDraw.length; row++) {
    for (let col = 0; col < matrixToDraw[row].length; col++) {
      const tile = matrixToDraw[row][col];
      drawTile(ctx, tile, col * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }
  }
};

const displayHud = (): void => {
  ctx.fillStyle = 'white';
  ctx.font = '18px Arial';
  ctx.fillText('Score: 0', 10, 20);
};


const gameLoop = (elapsedTime: number): void => {
  clearScreen();
  drawBackground(elapsedTime);
  drawCat(ctx, state.hero.x, state.hero.y);
  
  displayHud();

  // For now, just loop
  window.requestAnimationFrame(gameLoop);

  displayDebugInfo(elapsedTime);
}

const displayDebugInfo = (elapsedTime: number): void => {
  ctx.fillStyle = 'yellow';
  ctx.font = '14px Arial';
  ctx.fillText(`Elapsed Time: ${Math.floor(elapsedTime)} ms`, 10, canvas.height - 40);
  ctx.fillText(`Hero Position: (${state.hero.x}, ${state.hero.y})`, 10, canvas.height - 20);
}