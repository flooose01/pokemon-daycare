import Util from "../../Util.js";

export default class GameState {
  constructor(game) {
    this.game = game;
  }

  enter(params) {
    this.changeToShop = this.changeToShop.bind(this);
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

  changeToShop() {
    this.game.changeState("shop");
  }

  exit() {
    Util.id("shop").removeEventListener("click", this.changeToShop);
  }
}
