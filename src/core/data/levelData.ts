import { Peashooter } from "../plants/Peashooter";
import { Sunflower } from "../plants/Sunflower";
import { BucketHeadZombie } from "../zombies/BucketHeadZombie";
import { ConeHeadZombie } from "../zombies/ConeHeadZombie";
import { Zombie } from "../zombies/Zombie";

export const level = [
  {
    weightEntities: [
      { Entity: Zombie, weight: 12 },
      { Entity: ConeHeadZombie, weight: 3 },
      { Entity: BucketHeadZombie, weight: 1 },
    ],
    difficulty: 0.5,
  },
  {
    weightEntities: [
      { Entity: Zombie, weight: 12 },
      { Entity: ConeHeadZombie, weight: 3 },
      { Entity: BucketHeadZombie, weight: 1 },
    ],
    difficulty: 1.2,
  },
];

export const plants = [
  Sunflower,
  Peashooter
]