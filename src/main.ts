import { initializeCanvas } from './canvas';
import { startGame } from './Game';


window.addEventListener('load', () => {
    initializeCanvas();
    startGame();
});
