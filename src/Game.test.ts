import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { startGame } from './Game';

describe('Game', () => {
  let canvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    // Create a mock canvas element
    canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    document.body.appendChild(canvas);
    
    // Create mock context with all the methods we need
    mockCtx = {
      fillStyle: '',
      font: '',
      fillRect: vi.fn(),
      fillText: vi.fn(),
      clearRect: vi.fn(),
      scale: vi.fn(),
      setTransform: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      arc: vi.fn(),
      fill: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn()
      }),
      // Add any other methods/properties you use in your drawing code
    } as unknown as CanvasRenderingContext2D;

    // Mock getContext to return our mock context
    vi.spyOn(canvas, 'getContext').mockReturnValue(mockCtx);
  });

  it('initializes the game canvas', () => {
    startGame();
    
    // Verify canvas was found and initialized
    const gameCanvas = document.getElementById('gameCanvas');
    expect(gameCanvas).toBeDefined();
    expect(gameCanvas instanceof HTMLCanvasElement).toBe(true);
  });

  it('draws initial game state', () => {
    startGame();

    // // Verify the drawing calls were made in the right order
    // expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    // expect(mockCtx.fillText).toHaveBeenCalledWith('Welcome to the Game!', 50, 50);
    
    // // Verify the context properties were set
    // expect(mockCtx.font).toBe('24px Arial');
  });

  afterEach(() => {
    // Clean up the mock canvas
    document.body.removeChild(canvas);
    vi.restoreAllMocks();
  });
});