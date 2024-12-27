import { Gear } from '../component/Gear'; // Classe Gear
import { MechanicalLink } from './MechanicalLink'; // Classe MechanicalLink

import { VisualConfig } from '../component/Component';
import { Position } from '../types/Position';
type GearBaseConfig = {
  radius: { min: number, max: number }
  visual: VisualConfig;
  teeth: { count: number; height: number };
};

type GearLineConfig = {
  parent: HTMLElement;
  distance: number; // Distance totale à parcourir
  width: number //
  position: Position
  zIndex: number; // Niveau de profondeur des engrenages
  gearBases: GearBaseConfig[]; // Tableau de configurations de base pour les engrenages
};

export function createGearLine(config: GearLineConfig): Gear[] {
  const {
    parent,
    distance,
    width,
    position,
    zIndex,
    gearBases,
  } = config;

  const gears: Gear[] = [];
  let currentX = position.x;


  while (currentX < distance + position.x) {

    const baseConfig = gearBases[Math.floor(Math.random() * gearBases.length)]; // Récupérer une config de base
    const radius = Math.round(Math.random() * (baseConfig.radius.max - baseConfig.radius.min) + baseConfig.radius.min)
    const innerRadius = radius * (1 - baseConfig.teeth.height / 100)
    let centerY = 0
    let centerX = 0
    const previousGear = gears[gears.length - 1];
    if (gears.length > 0) {
      //limiter par la bande du haut ou que mon gear n'atteigne pas le precedent gear
      const cMin = Math.max(position.y - width / 2, previousGear.center.y - previousGear.innerRadius - innerRadius)
      const cMax = Math.min(position.y + width / 2, previousGear.center.y + previousGear.innerRadius + innerRadius)
      centerY = Math.random() * (cMax - cMin) + cMin
      //centerY = previousGear.center.y + 60

      centerX = previousGear.center.x + Math.sqrt(Math.pow(previousGear.innerRadius + innerRadius, 2) - Math.pow(previousGear.center.y - centerY, 2))
      currentX = centerX + radius
    }
    else {
      centerY = position.y + innerRadius
      centerX = position.x + radius
    }

    // Création de l'engrenage
    const gear = new Gear(parent, {
      position: { x: centerX - radius, y: centerY - radius },
      radius,
      teeth: baseConfig.teeth,
      visual: baseConfig.visual,
      zIndex,
    });

    if (gears.length > 0) {
      // Synchronisation mécanique avec l'engrenage précédent
      const dy = gear.center.y - previousGear.center.y;
      const dx = gear.center.x - previousGear.center.x;

      let contactAngle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360;

      if (contactAngle < 0) contactAngle += 360;
      const offsetToothAngle = (contactAngle - previousGear.rotateState) % previousGear.angleByTeeth
      gear.rotateState = contactAngle + 180 + offsetToothAngle - gear.angleByTeeth / 2
      // Vérification pour garder `rotateState` dans la plage [0, 360]
      gear.rotateState %= 360
      new MechanicalLink(previousGear, gear, MechanicalLink.gearLink);
    }


    gears.push(gear);


  }
  return gears;
}

