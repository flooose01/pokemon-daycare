import { DIALOG } from "../../constants.js";

const TALK_TIME = 2;
export default class PokemonFullState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.full;

  enter(def) {
    this.timer = TALK_TIME;
    this.isTalking = true;
    this.pokemon.dialog.textContent =
      PokemonFullState.dialog[
        parseInt(Math.random() * PokemonFullState.dialog.length)
      ];
  }

  update(dt) {
    this.timer -= dt;

    if (this.timer < 0) {
      this.isTalking = false;
      this.pokemon.changeState("idle");
    }
  }

  render() {
    if (this.isTalking) {
      this.pokemon.dialog.classList.remove("hidden");
    } else {
      this.pokemon.dialog.classList.add("hidden");
    }
  }

  exit() {
    this.pokemon.dialog.classList.add("hidden"); // Just make sure no dialog when exiting
  }
}
