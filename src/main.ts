import './style.css';
import { Gear } from './component/Gear';
import texture1 from '/texture/copper.jpg'
//import texture3 from '/texture/copper-shiny.avif'
import texture4 from '/texture/copper-rusty.jpg'
import { Component } from './component/Component';

const app = document.querySelector<HTMLDivElement>('#app')!;

const gear1 = new Gear(
  app, {
  radius: 100,
  position: { x: 500, y: 500 },
  visual: {
    texturePath: texture1, maskPath: '/mask/gear1.svg'
  }
}
)

Promise.all([
  (async () => {
    await gear1.mechanicalMoveTo({ x: 1500, y: 600 }, 5000);
    await gear1.moveTo({ x: 1100, y: 400 }, 5000);
  })(),
  (async () => {
    gear1.rotationSpeed = 2;
    await new Promise(resolve => setTimeout(resolve, 4000));
    gear1.clockwise = -1;
    await new Promise(resolve => setTimeout(resolve, 10000));
    gear1.rotationSpeed = 0;
  })(),
])

const rack1 = new Component(app, { size: { height: 100, width: 800 }, position: { x: 200, y: 700 }, visual: { maskPath: '/mask/rack.svg', texturePath: texture1 } })



