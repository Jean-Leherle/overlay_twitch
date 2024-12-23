import './style.css';
import { Gear } from './component/gear';
import texture1 from '/copper.png'

const app = document.querySelector<HTMLDivElement>('#app')!;

// Instancier un engrenage
const gear1Component = new Gear(app, {
  teeth: 12,
  radius: 50,
  rotationSpeed: 30,
  clockwise: false,
  position: { x: 50, y: 50 },
}, '/gear1.svg', texture1);

let i = 1

setInterval(() => {
  gear1Component.updateProps({
    position: {
      x: i, y: 50
    }
  });
  if (i % 2 === 0) i += 2
  else i -= 2

  if (i >= window.innerWidth - 100 || i <= 0) i++
}
  , 30)

