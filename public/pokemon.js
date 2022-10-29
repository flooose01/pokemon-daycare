import Util from "./util.js";
import PlayState from "./PlayState.js";
import { Tool } from "./constants.js";

export default class Pokemon {
  constructor(pokemon) {
    this.id = pokemon.id; // id of pokemon in pokedex
    this.name = pokemon.species.name;
    this.hunger = 0; // hunger level, 100 = dead
    this.exp = 0; // 500 -> 1st evolve, 2000 -> 2nd evolve
    this.poo = 0; //
    this.img = pokemon.sprites.front_default;
    this.nextEvolve = 2;
    this.vx = 0;
    this.vy = 0;
    this.position = (0, 0);
    this.talkTime = 0;
    this.block = this.generatePokemonBlock();
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
    this.updateTalking();
    this.updatePosition();
  }

  render(dt) {
    this.renderPokemon();
  }

  updatePosition() {}

  renderPokemon() {}

  generatePokemonBlock() {
    let dialog = Util.gen("p");
    dialog.classList.add("dialog");
    dialog.classList.add("hidden");

    let img = Util.gen("img");
    img.src = this.img;
    img.alt = this.name;

    let clickable = Util.gen("div");
    clickable.classList.add("clickable");
    clickable.addEventListener("click", () => {
      if (PlayState.tool == Tool.Food) {
        if (!this.isHungry()) {
          this.talk("full");
        } else {
          this.feed();
          this.talk("feed");
        }
      } else if ((PlayState.tool = Tool.Broom)) {
        this.talk("sweep");
      }
    });
    let block = Util.gen("div");
    block.appendChild(clickable);
    block.appendChild(dialog);
    block.appendChild(img);
    block.classList.add("block");
    block.id = "pokemon-" + this.id;
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
