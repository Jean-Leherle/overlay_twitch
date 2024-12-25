import './style.css';
import { Gear } from './component/Gear';
import texture1 from '/texture/copper.jpg'
//import texture3 from '/texture/copper-shiny.avif'
//import texture4 from '/texture/copper-rusty.jpg'
import { Component } from './component/Component';
import { MechanicalLink } from './link/MechanicalLink';

const app = document.querySelector<HTMLDivElement>('#app')!;

const gear1 = new Gear(
  app, {
  radius: 100,
  position: { x: 150, y: 525 },
  visual: {
    texturePath: texture1, maskPath: '/mask/gear1.svg'
  },
  zIndex: 35,
  teeth: {
    height: 37,
    number: 8
  }
}
)

const gear2 = new Gear(
  gear1.parentElement,
  {
    radius: 50,
    position: { x: 0, y: 0 },
    visual: {
      texturePath: texture1, maskPath: '/mask/gear1.svg'
    },
    zIndex: 100,
    teeth: {
      height: 37,
      number: 8
    }
  })


new MechanicalLink(gear1, gear2, MechanicalLink.synchronized)
Promise.all([
  (async () => {
    await gear1.mechanicalMoveTo({ x: 800, y: 525 }, 5000);
  })(),

])

const rack1 = new Component(app, {
  size: { height: 100, width: 800 },
  position: { x: 200, y: 700 },
  zIndex: 30,
  visual: {
    maskPath: '/mask/rack.svg',
    texturePath: texture1
  }
})



