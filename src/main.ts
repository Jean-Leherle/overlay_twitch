import './style.css';
import { Gear } from './component/gear';
import gearSVG from '/gear-svgrepo-com.svg?raw';
// Exemple de SVG pour un engrenage

// const gearSVG = `
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
//   <circle cx="50" cy="50" r="40" fill="none" stroke="black" stroke-width="4" />
//   <path d="M50,10 L55,30 L45,30 Z" fill="black" />
// </svg>`;

const app = document.querySelector<HTMLDivElement>('#app')!;

// Instancier un engrenage
const gear1 = new Gear(app, {
  teeth: 12,
  radius: 50,
  rotationSpeed: 60,
  clockwise: true,
  position: { x: 100, y: 100 },
}, gearSVG);

// Exemple : déplacer et ralentir l'engrenage après 3 secondes
setTimeout(() => {
  gear1.updateProps({
    rotationSpeed: 30,
    clockwise: false,
    position: { x: 200, y: 150 },
  });
}, 3000);
