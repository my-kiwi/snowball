export type Position = {
  x: number;
  y: number;
}

export type Hero = Position & {
  size: number;
  speed: number;
  lives: number;
}

export type StreetLamp = Position & {
  size: number;
  isOn: boolean;
};

export type Enemy = Position & {
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  isChasing: boolean;
}

export type Switch = Position & {
};