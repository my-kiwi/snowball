import { stat } from 'fs';
import { drawCat, drawTile } from './drawing';
import { levels, tileType, tileTypeToColor } from './levels';
const isDebugMap = true

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

const state = {
  controls: {
    pointer: {
      x: 0,
      y: 0,
      isDown: false
    },
    keysPressed: {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    }
  },
  bg: {
    x: 0,
    y: 0,
  },
  hero: {
    x: 100,
    y: 100,
    size: 30,
    speed: 2.5,
    mapPosition: { x: 0, y: 0 }
  },
  level: {
    current: 0,
    map: levels[0].map
  }
};

const updateCatPosition = (): void => {
  // Move hero based on keyboard input
  if (state.controls.keysPressed.ArrowUp) {
    state.hero.y -= state.hero.speed;
  }
  if (state.controls.keysPressed.ArrowDown) {
    state.hero.y += state.hero.speed;
  }
  if (state.controls.keysPressed.ArrowLeft) {
    state.hero.x -= state.hero.speed;
  }
  if (state.controls.keysPressed.ArrowRight) {
    state.hero.x += state.hero.speed;
  }

  // Move hero towards pointer if pointer is down
  if (state.controls.pointer.isDown) {
    // move hero towards the clicked position
    // calculate real x and y based on canvas size
    const rect = canvas.getBoundingClientRect();
    const x = (state.controls.pointer.x - rect.left) * (canvas.width / rect.width);
    const y = (state.controls.pointer.y - rect.top) * (canvas.height / rect.height);

    if (state.hero.x < x - state.hero.speed) {
      state.hero.x += state.hero.speed;
    } else if (state.hero.x > x + state.hero.speed) {
      state.hero.x -= state.hero.speed;
    }
    if (state.hero.y < y - state.hero.speed) {
      state.hero.y += state.hero.speed;
    } else if (state.hero.y > y + state.hero.speed) {
      state.hero.y -= state.hero.speed;
    }
  }
}

const addEventListeners = (): void => {
  window.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    state.controls.pointer = { x: e.clientX, y: e.clientY, isDown: true };
  }, { passive: false });

  window.addEventListener('pointerup', (e) => {
    e.preventDefault();
    state.controls.pointer.isDown = false;
  });

  window.addEventListener('pointermove', (e) => {
    e.preventDefault();
    if (state.controls.pointer.isDown) {
      state.controls.pointer = { x: e.clientX, y: e.clientY, isDown: true };
    }
  }, { passive: false });

  window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    state.controls.pointer = { x: e.touches[0].clientX, y: e.touches[0].clientY, isDown: true };
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (state.controls.pointer.isDown) {
      state.controls.pointer = { x: e.touches[0].clientX, y: e.touches[0].clientY, isDown: true };
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    e.preventDefault();
    // // Handle touch end
    state.controls.pointer.isDown = false;
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (e.key in state.controls.keysPressed) {
      state.controls.keysPressed[e.key as keyof typeof state.controls.keysPressed] = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key in state.controls.keysPressed) {
      state.controls.keysPressed[e.key as keyof typeof state.controls.keysPressed] = false;
    }
  });
} 

export const startGame = (): void => {
  canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // Ensure canvas size matches its displayed size to avoid distortion
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Handle high-DPI displays
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale the context to account for device pixel ratio

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

const drawBackground = (): void => {
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
  // state updates
  updateCatPosition();

  // drawing
  clearScreen();
  drawBackground();
  drawCat(ctx, state.hero.x, state.hero.y);
  
  displayHud();

  // schedule next frame
  window.requestAnimationFrame(gameLoop);

  displayDebugInfo(elapsedTime);
}

const displayDebugInfo = (elapsedTime: number): void => {
  ctx.fillStyle = 'yellow';
  ctx.font = '14px Arial';
  ctx.fillText(`Elapsed Time: ${Math.floor(elapsedTime)} ms`, 10, canvas.height - 40);
  ctx.fillText(`Hero Position: (${state.hero.x}, ${state.hero.y})`, 10, canvas.height - 20);
}