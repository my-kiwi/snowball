const dpr = window.devicePixelRatio || 1;

export const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export const initializeCanvas = (): void => {
    if (!canvas) {
        throw new Error('Canvas element not found');
    }
    if (!ctx) {
        throw new Error('2D context not available');
    }

    // Handle high-DPI displays
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale the context to account for device pixel ratio
    /* set autofocus on canvas so arrows are immediately reactive */
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
}

const WORLD_WIDTH = 512;
const WORLD_HEIGHT = 1024;

export const worldToCanvasSize = (worldSize: number): number => {
    return (worldSize / WORLD_WIDTH) * canvas.width / dpr;
}