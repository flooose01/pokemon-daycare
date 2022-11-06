import { DIALOG } from "../../constants.js";

export default class PokemonFeedState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.feed;

  enter(def) {}

  update(dt) {}

  render() {}

  exit() {}
}
