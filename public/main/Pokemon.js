import Util from "./Util.js";
import StateMachine from "./StateMachine.js";
import PokemonIdleState from "./states/entity/PokemonIdleState.js";
import PokemonHungryState from "./states/entity/PokemonHungryState.js";
import PokemonFullState from "./states/entity/PokemonFullState.js";
import PokemonFeedState from "./states/entity/PokemonFeedState.js";
import { DIRECTION_CHANGE_TIME, VELOCITY, SOUNDS } from "./constants.js";
import Poo from "./Poo.js";
import Pokemons from "./Pokemons.js";

export default class Pokemon {
  constructor(def) {
    // Pokemon information
    this.id = def.pokemon.id; // id of pokemon in pokedex
    this.name = def.pokemon.species.name;
    this.evolChain = def.pokemon.evolChain;
    this.nextEvolve = 1; // Evolve

    // Motion information
    this.vx = (Math.round(Math.random()) * 2 - 1) * VELOCITY;
    this.vy = (Math.round(Math.random()) * 2 - 1) * VELOCITY;
    this.lastMotionChange = 0;
    this.position = { x: Math.random() * 95 - 10, y: Math.random() * 90 };

    // HTML information
    this.block, this.dialog, this.img, this.clickable;
    this.generatePokemonBlock(def.pokemon.sprites.front_default);
    this.block.style.top = this.position.y + "%";
    this.block.style.left = this.position.x + "%";

    // Status information
    this.hunger = 0; // hunger level, 100 = dead
    this.exp = 0;
    this.pooTimer = 15;
    this.dead = false;

    // Reference to player and poos
    this.player = def.player;
    this.poos = def.poos;

    // This pokemon's state machine
    this.stateMachine = new StateMachine({
      hungry: new PokemonHungryState(this),
      idle: new PokemonIdleState(this),
      feed: new PokemonFeedState(this),
      full: new PokemonFullState(this),
    });

    this.changeState("idle");
  }

  changeState(state, def) {
    this.stateMachine.change(state, def);
  }

  generatePokemonBlock(img_file) {
    let dialog = Util.gen("p");
    dialog.classList.add(...["dialog", "hidden"]);
    this.dialog = dialog;

    let img = Util.gen("img");
    img.src = img_file;
    img.alt = this.name;
    this.img = img;

    let clickable = Util.gen("div");
    clickable.classList.add("clickable");
    this.clickable = clickable;
    let block = Util.gen("div");
    block.appendChild(clickable);
    block.appendChild(dialog);
    block.appendChild(img);
    block.classList.add("block");
    block.id = "pokemon-" + this.id;
    Util.id("game").appendChild(block);
    clickable.style.cursor = "url(img/food-cursor.png), auto";
    this.block = block;
  }

  update(dt) {
    this.hunger += dt;
    this.pooTimer -= dt;
    if (this.pooTimer < 0) {
      let poo = new Poo({
        player: this.player,
        position: { ...this.position },
      });
      SOUNDS.fart.play();
      this.poos.push(poo);
      this.pooTimer = 15;
    }
    this.updatePosition(dt);
    this.stateMachine.update(dt);
    this.updateEvolve(dt);
  }

  render() {
    this.renderPokemon();
    this.stateMachine.render();
  }

  /* UPDATES */

  updateEvolve(dt) {
    if (this.nextEvolve < this.evolChain.length) {
      let nextPokemon = Pokemons.pokemons[this.evolChain[this.nextEvolve]];
      if (this.nextEvolve == 1 && this.exp >= 50) {
        this.img.src = nextPokemon.sprites.front_default;
        this.name = nextPokemon.species.name;
        this.nextEvolve += 1;
      } else if (this.nextEvolve == 2 && this.exp >= 100) {
        this.img.src = nextPokemon.sprites.front_default;
        this.name = nextPokemon.species.name;
        this.nextEvolve += 1;
      }
    }
  }

  // Update position and motion of pokemon
  updatePosition(dt) {
    this.lastMotionChange += dt;
    if (this.lastMotionChange - DIRECTION_CHANGE_TIME > 0) {
      this.vx = Math.random() * (Math.round(Math.random()) * 2 - 1) * VELOCITY;
      this.vy = Math.random() * (Math.round(Math.random()) * 2 - 1) * VELOCITY;
      this.lastMotionChange = 0;
    }

    // Reverse velocity / direction
    if (
      (this.position.y <= -10 && this.vy < 0) ||
      (this.position.y >= 85 && this.vy > 0)
    ) {
      this.vy = -this.vy;
    }

    if (
      (this.position.x <= 0 && this.vx < 0) ||
      (this.position.x >= 90 && this.vx > 0)
    ) {
      this.vx = -this.vx;
    }

    this.position.x += this.vx * dt;
    this.position.y += this.vy * dt;
    // Reverse image if going right
    if (this.vx > 0) {
      this.img.classList.add("right");
    } else {
      this.img.classList.remove("right");
    }
  }

  /* RENDERS */
  renderPokemon() {
    this.block.style.top = this.position.y + "%";
    this.block.style.left = this.position.x + "%";
  }

  isHungry() {
    return this.hunger > 15;
  }
}
