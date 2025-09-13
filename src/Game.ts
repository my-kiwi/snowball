import { canvas, ctx, worldToCanvasSize } from './canvas';
import { drawCat, drawBackground, drawEnemy, drawStreetlamp } from './drawing';
import { getNextLevel, levels, tileType } from './levels';
import { addControlsEventListeners, controls } from './controls';

const START_LEVEL_INDEX = 0; // reset to 0 before pushing to production
const MAX_LIVES = 9;
const HERO_SPEED = 2.5;
const ENEMY_SPEED = 3;
const SWITCH_DELAY = 5000;

let isWon = false;

export const STREET_LAMP_RADIUS = 130;
const STREET_LAMP_RADIUS_DETECTION = STREET_LAMP_RADIUS - 10; // slightly smaller so that enemies don't start chasing too early

const state = {
  bg: {
    x: 0,
    y: 0,
  },
  hero: {
    x: 100,
    y: 100,
    size: 30,
    speed: HERO_SPEED, // is it changing ever?
    mapPosition: { x: 0, y: 0 },
    lives: MAX_LIVES,
  },
  streetlamps: [] as { x: number; y: number; size: number, isOn: boolean }[],
  ennemies: [] as { x: number; y: number; size: number; speed: number; direction: number, isChasing: boolean }[],
  level: levels[START_LEVEL_INDEX],
};

const getNextPosition = (currentPos: { x: number, y: number }, speed: number): { x: number; y: number } => {
  let nextPosX = currentPos.x;
  let nextPosY = currentPos.y;
  // Move hero based on keyboard input
  if (controls.keysPressed.ArrowUp) {
    nextPosY -= speed;
  }
  if (controls.keysPressed.ArrowDown) {
    nextPosY += speed;
  }
  if (controls.keysPressed.ArrowLeft) {
    nextPosX -= speed;
  }
  if (controls.keysPressed.ArrowRight) {
    nextPosX += speed;
  }

  // Move hero towards pointer if pointer is down
  if (controls.pointer.isDown) {
    // move hero towards the clicked position
    // calculate real x and y based on canvas size
    const rect = canvas.getBoundingClientRect();
    const x = (controls.pointer.x - rect.left) * (canvas.clientWidth / rect.width);
    const y = (controls.pointer.y - rect.top) * (canvas.clientHeight / rect.height);

    const angleToClick = Math.atan2(y - state.hero.y, x - state.hero.x);

    nextPosX += Math.cos(angleToClick) * state.hero.speed;
    nextPosY += Math.sin(angleToClick) * state.hero.speed;
  }

  return { x: nextPosX, y: nextPosY };
}

export const startGame = (): void => {
  state.level = levels[START_LEVEL_INDEX];
  state.hero.speed = worldToCanvasSize(HERO_SPEED);
  addControlsEventListeners();
  resetActorsPositions();

  // Start the game loop
  window.requestAnimationFrame(gameLoop);
}

const resetActorsPositions = (): void => {
  // reset enemies and streetlamps arrays
  state.ennemies = [];
  state.streetlamps = [];

  const cellWidth = canvas.clientWidth / state.level.map[0].length;
  const cellHeight = canvas.clientHeight / state.level.map.length;
  // set hero at the tile marked as 'H' in the level map
  for (let row = 0; row < state.level.map.length; row++) {
    for (let col = 0; col < state.level.map[row].length; col++) {
      switch (state.level.map[row][col]) {
        case tileType.hero:
          state.hero.x = col * cellWidth + cellWidth / 2;
          state.hero.y = row * cellHeight + cellHeight / 2;
          break;
        case tileType.streetlamp:
          state.streetlamps.push({
            x: col * cellWidth + cellWidth / 2,
            y: row * cellHeight + cellHeight / 2,
            size: 50,
            isOn: true,
          });
          break;
        case tileType.enemy:
          state.ennemies.push({
            x: col * cellWidth + cellWidth / 2,
            y: row * cellHeight + cellHeight / 2,
            size: 30,
            speed: worldToCanvasSize(ENEMY_SPEED),
            direction: Math.random() * 2 * Math.PI,
            isChasing: false,
          });
          break;
      }
    }
  }
}

const clearScreen = (): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const displayHud = (): void => {
  ctx.fillStyle = 'white';
  ctx.font = `${worldToCanvasSize(20)}px Arial`;
  ctx.fillText(state.level.name, worldToCanvasSize(10), worldToCanvasSize(25));

  ctx.fillText(`Lives: ${state.hero.lives}`, canvas.clientWidth - worldToCanvasSize(100), worldToCanvasSize(25));
};

const updateCatPosition = (): void => {
  const { x: nextPosX, y: nextPosY } = getNextPosition({ x: state.hero.x, y: state.hero.y }, state.hero.speed);

  // check for collisions with walls
  const matrix = state.level.map;
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

const loseLife = (): void => {
  state.hero.lives -= 1;
  if (state.hero.lives <= 0) {
    // reset game
    state.hero.lives = MAX_LIVES;
    state.level = levels[START_LEVEL_INDEX];
  }
  resetActorsPositions();
}

const goToNextLevel = (elapsedTime: number): void => {
  const nextLevel = getNextLevel(state.level);
  if (nextLevel) {
    state.level = nextLevel;
    resetActorsPositions();
  } else {
    // no more levels, reset to first level
    // eventually could show a "you win" screen with option to restart
    // with the score being the number of lives left x 1000 / time taken
    // for now just reset to first level
    console.log('won');
    isWon = true;
    
    ctx.fillStyle = 'yellow';
    ctx.font = '34px Arial';
    resetActorsPositions();

    ctx.fillText(`You won! Time: ${Math.floor(elapsedTime/1000)} s`, 50, canvas.clientHeight / 2);
    
    ctx.fillText('click to restart', 50, (canvas.clientHeight / 2) + 34);
    const retry = () => {
      window.removeEventListener('pointerdown', retry);
      isWon = false;
      startGame();
    }
    window.addEventListener('pointerdown', retry);
  }
}

const checkCollisions = (elapsedTime: number): void => {
  const matrix = state.level.map;
  const cellWidth = canvas.clientWidth / matrix[0].length;
  const cellHeight = canvas.clientHeight / matrix.length;

  const col = Math.floor(state.hero.x / cellWidth);
  const row = Math.floor(state.hero.y / cellHeight);

  if (row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length) {
    const tile = matrix[row][col];
    switch (tile) {
      case tileType.gap:
        loseLife();
        break;
      case tileType.exit:
        goToNextLevel(elapsedTime);
        break;
      case tileType.switchOff:
        state.streetlamps
          .filter(l => l.isOn)
          .forEach(l => {
            l.isOn = false;
            setTimeout(() => l.isOn = true, SWITCH_DELAY);
          });
        break;
    }
  }

  // check if hero is close to a lamp which is close to an enemy
  state.ennemies.forEach(enemy => {
    // if enemy is in range of streetlamp, it moves towards the hero
    state.streetlamps
      .filter(lamp => lamp.isOn)
      .forEach(lamp => {
        const dxLamp = enemy.x - lamp.x;
        const dyLamp = enemy.y - lamp.y;
        const distanceToLamp = Math.sqrt(dxLamp * dxLamp + dyLamp * dyLamp);

        if (distanceToLamp < worldToCanvasSize(STREET_LAMP_RADIUS_DETECTION)) { // lamp influence radius
          // if hero is also in range of the lamp
          const dxHero = state.hero.x - lamp.x;
          const dyHero = state.hero.y - lamp.y;
          const distanceHeroToLamp = Math.sqrt(dxHero * dxHero + dyHero * dyHero);
          if (distanceHeroToLamp < worldToCanvasSize(STREET_LAMP_RADIUS_DETECTION)) {
            // enemies chase the hero relentlessly
            enemy.isChasing = true;
          }
        }
      });

    const dx = enemy.x - state.hero.x;
    const dy = enemy.y - state.hero.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (state.hero.size + enemy.size) / 2) {
      // collision with enemy
      loseLife();
    }
  });
}

const updateActorsPositions = (): void => {
  updateCatPosition();

  // update enemies positions
  state.ennemies
    .filter(enemy => enemy.isChasing)
    .forEach(enemy => {
      // move enemy towards hero
      const angleToHero = Math.atan2(state.hero.y - enemy.y, state.hero.x - enemy.x);
      enemy.direction = angleToHero;
      enemy.x += Math.cos(enemy.direction) * enemy.speed;
      enemy.y += Math.sin(enemy.direction) * enemy.speed;
    });
}

const gameLoop = (elapsedTime: number): void => {
  // state updates
  updateActorsPositions();
  checkCollisions(elapsedTime);
  if(isWon) return;

  // drawing
  clearScreen();
  drawBackground(state.level.map)

  state.streetlamps.forEach(lamp => drawStreetlamp(lamp.x, lamp.y, lamp.isOn)); 
  drawCat(ctx, state.hero.x, state.hero.y);
  state.ennemies.forEach(enemy => {
    drawEnemy(ctx, enemy.x, enemy.y);
  });

  displayHud();

  // schedule next frame
  window.requestAnimationFrame(gameLoop);

  // displayDebugInfo(elapsedTime);
}

const displayDebugInfo = (elapsedTime: number): void => {
  ctx.fillStyle = 'yellow';
  ctx.font = '14px Arial';
  ctx.fillText(`Elapsed Time: ${Math.floor(elapsedTime)} ms`, 10, canvas.clientHeight - 40);
  ctx.fillText(`Hero Position: (${state.hero.x}, ${state.hero.y})`, 10, canvas.clientHeight - 20);
}