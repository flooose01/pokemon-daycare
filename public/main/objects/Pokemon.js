import Util from "../Util.js";
import { DIRECTION_CHANGE_TIME, Tool, VELOCITY } from "../constants.js";
import GameState from "../GameState.js";

export default class Pokemon {
  constructor(pokemon) {
    this.id = pokemon.id; // id of pokemon in pokedex
    this.name = pokemon.species.name;
    this.hunger = 0; // hunger level, 100 = dead
    this.exp = 0; // TODO: decide threshold
    this.poo = 0;
    this.img = pokemon.sprites.front_default;
    this.nextEvolve = 2;
    this.vx = VELOCITY;
    this.vy = VELOCITY;
    this.lastVerticalChange = 0;
    this.lastHorizontalChange = 0;
    this.talkTime = 0;
    this.block = this.generatePokemonBlock();
    this.position = { x: 40, y: 40 }; // left upper corner
  }

  static dialogs = {
    hungry: ["feed me!", "FOOD!", "i demand my berry"],
    sweep: ["hey!!!", "watch it", "rawr"],
    collide: ["hello", "watch out"],
    smelly: ["🤢", "stinky"],
    feed: ["yummy", "nyam nyam"],
    idle: ["hi trainer", "nice day"],
    full: ["im full", "stop feeding me"],
  };

  static async make(id) {
    let pokemon = await Util.fetchURL(
      "https://pokeapi.co/api/v2/pokemon/" + id
    );
    return new Pokemon(pokemon);
  }

  update(dt) {
    // this.updateTalking();
    this.updatePosition(dt);
  }

  render(dt) {
    this.renderPokemon(dt);
  }

  updatePosition(dt) {
    this.lastVerticalChange += dt;
    this.lastHorizontalChange += dt;
    if (this.lastHorizontalChange - DIRECTION_CHANGE_TIME > 0) {
      this.vx = Math.random() * (Math.round(Math.random()) * 2 - 1) * VELOCITY;
      this.lastHorizontalChange = 0;
    }
    if (this.lastVerticalChange - DIRECTION_CHANGE_TIME > 0) {
      this.vy = Math.random() * (Math.round(Math.random()) * 2 - 1) * VELOCITY;
      this.lastVerticalChange = 0;
    }

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
      if (this.vx > 0) {
        Util.qs("#pokemon-" + this.id + " img").classList.add("right");
      } else {
        Util.qs("#pokemon-" + this.id + " img").classList.remove("right");
      }
    }

    this.position.x += this.vx * dt;
    this.position.y += this.vy * dt;
  }

  renderPokemon() {
    this.block.style.top = this.position.y + "%";
    this.block.style.left = this.position.x + "%";
  }

  /**
   * Generates html block of pokemon
   * @returns
   */
  generatePokemonBlock() {
    let dialog = Util.gen("p");
    dialog.classList.add(...["dialog", "hidden"]);

    let img = Util.gen("img");
    img.src = this.img;
    img.alt = this.name;

    let clickable = Util.gen("div");
    clickable.classList.add("clickable");
    clickable.addEventListener("click", () => {
      if (GameState.state.tool == Tool.Food) {
        if (!this.isHungry()) {
          this.talk("full");
        } else {
          this.feed();
          this.talk("feed");
        }
      } else if (GameState.state.tool == Tool.Broom) {
        this.talk("sweep");
      }
    });
    let block = Util.gen("div");
    block.appendChild(clickable);
    block.appendChild(dialog);
    block.appendChild(img);
    block.classList.add("block");
    block.id = "pokemon-" + this.id;
    Util.id("game").appendChild(block);
    return block;
  }

  isTalking() {
    return this.talkTime > 0;
  }

  talk(feeling) {
    if (!this.isTalking()) {
      let dialog = Util.qs("#pokemon-" + this.id + " p");
      dialog.textContent =
        dialogs[feeling][parseInt(Math.random() * dialogs[feeling].length)];
      dialog.classList.remove("hidden");
      this.talkTime = 3000;
    }
  }

  shut() {
    let dialog = Util.qs("#pokemon-" + this.id + " p");
    dialog.textContent = "";
    dialog.classList.add("hidden");
    this.isTalking = false;
  }

  updateTalking() {
    if (this.talkTime > 0) {
      this.talkTime -= dt;
    } else if (this.talkTime <= 0) {
      this.talkTime = 0;
      this.shut();
    }
  }

  isHungry() {
    return this.hunger > 50;
  }

  isPoo() {
    return this.poo > 100;
  }
}
