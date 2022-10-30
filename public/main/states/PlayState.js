import Util from "../Util.js";
import { Tool } from "../constants.js";

export default class PlayState {
  static enter(def) {
    Util.id("food").addEventListener("click", () => {
      this.tool = Tool.Food;
      this.updateTool();
    });
    Util.id("broom").addEventListener("click", () => {
      this.tool = Tool.Broom;
      this.updateTool();
    });
    this.tool = null;
    this.pokemons = def.pokemons;
  }

  static update(dt) {
    for (let pokemon in this.pokemons) {
      pokemon.update(dt);
    }
  }

  static render() {
    for (let pokemon in this.pokemons) {
      pokemon.render();
    }
  }

  static updateTool() {
    if (this.tool == Tool.Food) {
      Util.id("food").classList.add("selected");
      Util.id("broom").classList.remove("selected");
      let clickableBlocks = Util.qsa(".clickable");
      for (let i = 0; i < clickableBlocks.length; i++) {
        clickableBlocks[i].style.cursor = "url(img/food-cursor.png), auto";
      }
    } else if (this.tool == Tool.Broom) {
      Util.id("food").classList.remove("selected");
      Util.id("broom").classList.add("selected");
      let clickableBlocks = Util.qsa(".clickable");
      for (let i = 0; i < clickableBlocks.length; i++) {
        clickableBlocks[i].style.cursor = "url(img/broom-cursor.png), auto";
      }
    }
  }
}
