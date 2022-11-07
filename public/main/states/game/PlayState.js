import Util from "../../Util.js";
import { TOOL } from "../../constants.js";

export default class PlayState {
  enter(def) {
    Util.id("food").addEventListener("click", () => {
      this.tool = TOOL.food;
      this.updateTool();
    });
    Util.id("broom").addEventListener("click", () => {
      this.tool = TOOL.broom;
      this.updateTool();
    });
    this.tool = null;
    this.pokemons = def.pokemons;
  }

  update(dt) {
    for (let i = 0; i < this.pokemons.length; i++) {
      this.pokemons[i].update(dt);
    }
  }

  render() {
    for (let i = 0; i < this.pokemons.length; i++) {
      this.pokemons[i].render();
    }
  }

  updateTool() {
    if (this.tool == TOOL.food) {
      Util.id("food").classList.add("selected");
      Util.id("broom").classList.remove("selected");
      let clickableBlocks = Util.qsa(".clickable");
      for (let i = 0; i < clickableBlocks.length; i++) {
        clickableBlocks[i].style.cursor = "url(img/food-cursor.png), auto";
      }
    } else if (this.tool == TOOL.broom) {
      Util.id("food").classList.remove("selected");
      Util.id("broom").classList.add("selected");
      let clickableBlocks = Util.qsa(".clickable");
      for (let i = 0; i < clickableBlocks.length; i++) {
        clickableBlocks[i].style.cursor = "url(img/broom-cursor.png), auto";
      }
    }
  }

  exit() {}
}
