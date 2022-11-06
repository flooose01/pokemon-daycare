import { DIALOG } from "../../constants.js";

export default class PokemonHungryState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.hungry;

  enter(def) {}

  update(dt) {}

  render() {}

  exit() {}
}
