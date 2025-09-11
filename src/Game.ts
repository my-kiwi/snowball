import { canvas, ctx } from './canvas';
import { drawCat, drawTile } from './drawing';
import { levels, tileType, tileTypeToColor } from './levels';


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

const getNextPosition = (currentPos: { x: number, y: number }, speed: number): { x: number; y: number } => {
  let nextPosX = currentPos.x;
  let nextPosY = currentPos.y;
  // Move hero based on keyboard input
  if (state.controls.keysPressed.ArrowUp) {
    nextPosY -= speed;
  }
  if (state.controls.keysPressed.ArrowDown) {
    nextPosY += speed;
  }
  if (state.controls.keysPressed.ArrowLeft) {
    nextPosX -= speed;
  }
  if (state.controls.keysPressed.ArrowRight) {
    nextPosX += speed;
  }

  // Move hero towards pointer if pointer is down
  if (state.controls.pointer.isDown) {
    // move hero towards the clicked position
    // calculate real x and y based on canvas size
    const rect = canvas.getBoundingClientRect();
    const x = (state.controls.pointer.x - rect.left) * (canvas.clientWidth / rect.width);
    const y = (state.controls.pointer.y - rect.top) * (canvas.clientHeight / rect.height);

    if (currentPos.x < x - speed) {
      nextPosX += speed;
    } else if (currentPos.x > x + speed) {
      nextPosX -= speed;
    }
    if (currentPos.y < y - speed) {
      nextPosY += speed;
    } else if (currentPos.y > y + speed) {
      nextPosY -= speed;
    }
  }

  return { x: nextPosX, y: nextPosY };
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
        const cellWidth = canvas.clientWidth / state.level.map[0].length;
        const cellHeight = canvas.clientHeight / state.level.map.length;
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
  const cellWidth = canvas.clientWidth / matrixToDraw[0].length;
  const cellHeight = canvas.clientHeight / matrixToDraw.length;

  // first draw the entire background as road
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

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

const updateCatPosition = (): void => {
  const { x: nextPosX, y: nextPosY } = getNextPosition({ x: state.hero.x, y: state.hero.y }, state.hero.speed);

  // check for collisions with walls
  const matrix = getCurrentLevelMatrix();
  const cellWidth = canvas.clientWidth / matrix[0].length;
  const cellHeight = canvas.clientHeight / matrix.length;

  const col = Math.floor(nextPosX / cellWidth);
  const row = Math.floor(nextPosY / cellHeight);

  if (row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length) {
    const tile = matrix[row][col];
    if (tile !== tileType.wall) {
      state.hero.x = nextPosX;
      state.hero.y = nextPosY;
    }
  } else {
    // out of bounds, do not move
  }
}


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
  ctx.fillText(`Elapsed Time: ${Math.floor(elapsedTime)} ms`, 10, canvas.clientHeight - 40);
  ctx.fillText(`Hero Position: (${state.hero.x}, ${state.hero.y})`, 10, canvas.clientHeight - 20);
}