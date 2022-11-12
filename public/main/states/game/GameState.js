import { TOOL } from "../../constants.js";
import Util from "../../Util.js";

export default class GameState {
  constructor(game) {
    this.game = game;
  }

  enter(params) {
    this.setToFood = this.setToFood.bind(this);
    this.setToBroom = this.setToBroom.bind(this);
    this.changeToShop = this.changeToShop.bind(this);
    Util.id("food").addEventListener("click", this.setToFood);
    Util.id("broom").addEventListener("click", this.setToBroom);
    Util.id("shop").addEventListener("click", this.changeToShop);
  }

  update(dt) {
    for (let i = 0; i < this.game.pokemons.length; i++) {
      if (this.game.pokemons[i] != null) {
        this.game.pokemons[i].update(dt);
        if (this.game.pokemons[i].dead) {
          this.game.pokemons[i] = null;
        }
      }
    }

    for (let i = 0; i < this.game.poos.length; i++) {
      if (this.game.poos[i] != null) {
        this.game.poos[i].update(dt);
        if (this.game.poos[i].expired) {
          this.game.poos[i] = null;
        }
      }
    }

    this.updateTool(dt);
  }

  render() {
    for (let i = 0; i < this.game.pokemons.length; i++) {
      if (this.game.pokemons[i] != null) {
        this.game.pokemons[i].render();
      }
    }

    for (let i = 0; i < this.game.poos.length; i++) {
      if (this.game.poos[i] != null) {
        this.game.poos[i].render();
      }
    }

    this.game.player.render();
  }

  updateTool(dt) {
    if (this.game.tool == TOOL.food) {
      Util.id("food").classList.add("selected");
      Util.id("broom").classList.remove("selected");
      let clickableBlocks = Util.qsa(".clickable");
      for (let i = 0; i < clickableBlocks.length; i++) {
        clickableBlocks[i].style.cursor = "url(img/food-cursor.png), auto";
      }
    } else if (this.game.tool == TOOL.broom) {
      Util.id("food").classList.remove("selected");
      Util.id("broom").classList.add("selected");
      let clickableBlocks = Util.qsa(".clickable");
      for (let i = 0; i < clickableBlocks.length; i++) {
        clickableBlocks[i].style.cursor = "url(img/broom-cursor.png), auto";
      }
    }
  }

  setToFood() {
    this.game.tool = TOOL.food;
  }

  setToBroom() {
    this.game.tool = TOOL.broom;
  }

  changeToShop() {
    this.game.changeState("shop");
  }

  exit() {
    Util.id("food").removeEventListener("click", this.setToFood);
    Util.id("broom").removeEventListener("click", this.setToBroom);
    Util.id("shop").removeEventListener("click", this.changeToShop);
  }
}
