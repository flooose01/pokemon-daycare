import { DIALOG } from "../../constants.js";

const TALK_TIME = 2;
export default class PokemonFeedState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.feed;

  enter(def) {
    this.pokemon.img.classList.remove("hungry"); // Not hungry anymmore
    this.pokemon.exp += 10;
    this.pokemon.hunger = 0;
    this.timer = TALK_TIME;
    this.isTalking = true;
    this.pokemon.dialog.textContent =
      PokemonFeedState.dialog[
        parseInt(Math.random() * PokemonFeedState.dialog.length)
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