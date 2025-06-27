import { Gear } from "../component/Gear";
import { MechanicalLink } from "./MechanicalLink";

export function setPerfectRotateState(previousGear: Gear, gear: Gear,) {
  const dy = gear.center.y - previousGear.center.y;
  const dx = gear.center.x - previousGear.center.x;

  let contactAngle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360;

  if (contactAngle < 0) contactAngle += 360;
  const offsetToothAngle = (contactAngle - previousGear.rotateState) % previousGear.angleByTeeth;
  gear.rotateState = contactAngle + 180 + gear.angleByTeeth * offsetToothAngle / previousGear.angleByTeeth - gear.angleByTeeth / 2;
  gear.rotateState %= 360;
  new MechanicalLink(previousGear, gear, MechanicalLink.gearLink);
}

interface IrregularRotateOptions {
  acceleration?: number;
  maxSpeed?: number;
  minSpeed?: number;
  waitingTime?: number;
  runningTime?: number;
}

export function irregularRotate(gear: Gear, options: IrregularRotateOptions = {}) {
  const {
    acceleration = 1,
    maxSpeed = 10,
    minSpeed = 0.1,
    waitingTime = 1000,
    runningTime = 2000
  } = options;

  let speed = minSpeed;
  let phase: 'accelerating' | 'running' | 'decelerating' | 'waiting' = 'accelerating';
  let phaseStartTime: number | null = null;

  const accelPerMs = acceleration / 1000;

  function step(timestamp: number) {
    if (!phaseStartTime) phaseStartTime = timestamp;
    const elapsed = timestamp - phaseStartTime;

    switch (phase) {
      case 'accelerating':
        speed = Math.min(maxSpeed, speed + accelPerMs * elapsed);
        gear.rotationSpeed = speed;

        if (speed >= maxSpeed) {
          speed = maxSpeed;
          phase = 'running';
          phaseStartTime = timestamp;
        }
        break;

      case 'running':
        gear.rotationSpeed = speed;

        if (elapsed >= runningTime) {
          phase = 'decelerating';
          phaseStartTime = timestamp;
        }
        break;

      case 'decelerating':
        speed = Math.max(minSpeed, speed - accelPerMs * elapsed);
        gear.rotationSpeed = speed;

        if (speed <= minSpeed) {
          speed = minSpeed;
          phase = 'waiting';
          phaseStartTime = timestamp;
        }
        break;

      case 'waiting':
        gear.rotationSpeed = speed;

        if (elapsed >= waitingTime) {
          phase = 'accelerating';
          phaseStartTime = timestamp;
        }
        break;
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

type coordonateConfig = { innerRadius: number } & (
  { fixedCenter: { x: number }, orientation: 'down' | 'up' } |
  { fixedCenter: { y: number }, orientation: 'left' | 'right' });


export function centerTocontactGear(previousGear: Gear, config: coordonateConfig): number {
  const { innerRadius, fixedCenter, orientation } = config;

  const hypotenuse = previousGear.innerRadius + innerRadius;
  if ('x' in fixedCenter) {
    // Axe X fixe : on calcule le delta en Y
    const distanceX = Math.abs(fixedCenter.x - previousGear.center.x);
    if (distanceX > hypotenuse) {
      throw new Error(`Impossible de calculer deltaY : distanceX (${distanceX}) > maxDistance (${hypotenuse})`);
    }

    const deltaY = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(distanceX, 2));
    if (orientation === 'up') {
      return previousGear.center.y - deltaY;
    }
    else {
      return previousGear.center.y + deltaY;
    }
  }
  else {
    const distanceY = Math.abs(fixedCenter.y - previousGear.center.y);
    if (distanceY > hypotenuse) {
      throw new Error(`Impossible de calculer deltaY : distanceY (${distanceY}) > maxDistance (${hypotenuse})`);
    }

    const deltaX = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(distanceY, 2));

    if (orientation === 'left') {
      return previousGear.center.x - deltaX;
    }
    else {
      return previousGear.center.x + deltaX;
    }
  }
}