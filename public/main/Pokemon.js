import Util from "./Util.js";
import StateMachine from "./StateMachine.js";
import PokemonIdleState from "./states/entity/PokemonIdleState.js";
import PokemonHungryState from "./states/entity/PokemonHungryState.js";
import PokemonFullState from "./states/entity/PokemonFullState.js";
import PokemonFeedState from "./states/entity/PokemonFeedState.js";
import PokemonSweepState from "./states/entity/PokemonSweepState.js";
import { DIRECTION_CHANGE_TIME, VELOCITY, SOUNDS } from "./constants.js";
import Poo from "./Poo.js";

export default class Pokemon {
  constructor(def) {
    // Pokemon information
    this.id = def.pokemon.id; // id of pokemon in pokedex
    this.name = def.pokemon.species.name;
    this.nextEvolve = 2; // Evolve

    // Motion information
    this.vx = VELOCITY;
    this.vy = VELOCITY;
    this.lastMotionChange = 0;
    this.position = { x: 40, y: 40 };

    // HTML information
    this.block, this.dialog, this.img, this.clickable;
    this.generatePokemonBlock(def.pokemon.sprites.front_default);

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
      sweep: new PokemonSweepState(this),
    });
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
  }

  render() {
    this.renderPokemon();
    this.stateMachine.render();
  }

  /* UPDATES */

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
      (this.position.y >= 90 && this.vy > 0)
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
