
import { app } from './app/app';

export class Hero {
    id: number = 998;
    name: string;

    constructor(name) {
        this.name = name;
    }
  }

  let hero = new Hero('krunal');
  console.log(hero);
  