import Util from "./Util.js";
import StateMachine from "./StateMachine.js";
import PokemonIdleState from "./states/entity/PokemonIdleState.js";
import PokemonHungryState from "./states/entity/PokemonHungryState.js";
import PokemonFullState from "./states/entity/PokemonFullState.js";
import PokemonFeedState from "./states/entity/PokemonFeedState.js";
import { DIRECTION_CHANGE_TIME, VELOCITY } from "./constants.js";

export default class Pokemon {
  constructor(pokemon) {
    // Pokemon information
    this.id = pokemon.id; // id of pokemon in pokedex
    this.name = pokemon.species.name;
    this.nextEvolve = 2; // Evolve

    // Motion information
    this.vx = VELOCITY;
    this.vy = VELOCITY;
    this.lastMotionChange = 0;
    this.position = { x: 40, y: 40 }; // left upper corner

    // HTML information
    this.block, this.dialog, this.img, this.clickable;
    this.generatePokemonBlock(pokemon.sprites.front_default);

    // Status information
    this.hunger = 0; // hunger level, 100 = dead
    this.exp = 0;
    this.poo = 0;

    // This pokemon's state machine
    this.stateMachine = new StateMachine({
      hungry: new PokemonHungryState(this),
      idle: new PokemonIdleState(this),
      feed: new PokemonFeedState(this),
      full: new PokemonFullState(this),
    });
  }

  static async make(id) {
    let pokemon = await Util.fetchURL(
      "https://pokeapi.co/api/v2/pokemon/" + id
    );
    return new Pokemon(pokemon);
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
      (this.position.x <= -5 && this.vx < 0) ||
      (this.position.x >= 95 && this.vx > 0)
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
    return this.hunger > 10;
  }
}
