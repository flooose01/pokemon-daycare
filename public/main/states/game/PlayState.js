import Util from "../../Util.js";
import { TOOL } from "../../constants.js";
import Player from "../../Player.js";
import Pokemon from "../../Pokemon.js";
import { GEN_ONE_POKEMONS } from "../../../index.js";

export default class PlayState {
  enter(params) {
    Util.id("food").addEventListener("click", () => {
      this.tool = TOOL.food;
      this.updateTool();
    });
    Util.id("broom").addEventListener("click", () => {
      this.tool = TOOL.broom;
      this.updateTool();
    });

    this.player = new Player();
    this.tool = null;
    this.poos = [];
    let pokemon = new Pokemon({
      pokemon: GEN_ONE_POKEMONS[params.starterID],
      player: this.player,
      poos: this.poos,
    });
    pokemon.changeState("idle");
    this.pokemons = [pokemon];
  }

  update(dt) {
    for (let i = 0; i < this.pokemons.length; i++) {
      if (this.pokemons[i] != null) {
        this.pokemons[i].update(dt);
        if (this.pokemons[i].dead) {
          this.pokemons[i] = null;
        }
      }
    }

    for (let i = 0; i < this.poos.length; i++) {
      if (this.poos[i] != null) {
        this.poos[i].update(dt);
        if (this.poos[i].expired) {
          this.poos[i] = null;
        }
      }
    }

    this.updateTool(dt);
  }

  render() {
    for (let i = 0; i < this.pokemons.length; i++) {
      if (this.pokemons[i] != null) {
        this.pokemons[i].render();
      }
    }

    for (let i = 0; i < this.poos.length; i++) {
      if (this.poos[i] != null) {
        this.poos[i].render();
      }
    }

    this.player.render();
  }

  updateTool(dt) {
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
