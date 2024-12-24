import './style.css';
import { Gear } from './component/gear';
import texture1 from '/texture/copper.png'

const app = document.querySelector<HTMLDivElement>('#app')!;

// Instancier un engrenage
const gear1Component = new Gear(app, {
  teeth: { number: 8, height: 20, width: 15 },
  radius: 50,
  position: { x: 50, y: 50 },
  zIndex: 2,
}, '/mask/gear1.svg', texture1);

const gear2Component = new Gear(app, {
  teeth: { number: 8, height: 0, width: 15 },
  radius: 20,
  position: { x: 100, y: 50 },
  zIndex: 1,
  clockwise: false,
  rotationSpeed: 2
}, '/mask/gear1.svg', texture1);

Promise.all([
  (async () => {
    await gear1Component.transtalteTo({ x: 500, y: 200 }, 5000);
    await gear1Component.transtalteTo({ x: 100, y: 50 }, 5000);
  })(),
  gear2Component.moveTo({ x: gear2Component.props.position.x, y: gear2Component.props.position.y + 200 }, 3000)
])

console.log(gear1Component.getDist(gear1Component.props.position, { x: 53, y: 46 }))



