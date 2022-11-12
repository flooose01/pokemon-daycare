import { DIALOG } from "../../constants.js";

const TALK_TIME = 0.5;
export default class PokemonSweepState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.sweep;

  enter(params) {
    this.prev = params.prev;
    this.timer = 1;
    this.isTalking = true;
    this.pokemon.dialog.textContent =
      PokemonSweepState.dialog[
        parseInt(Math.random() * PokemonSweepState.dialog.length)
      ];
  }

  update(dt) {
    this.timer -= dt;

    if (this.timer < 0) {
      this.isTalking = false;
      this.pokemon.changeState(this.prev);
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
