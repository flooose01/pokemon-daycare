import Player from "../../Player.js";
import Pokemon from "../../Pokemon.js";
import StateMachine from "../../StateMachine.js";
import ShopState from "./ShopState.js";
import GameState from "./GameState.js";
import Pokemons from "../../Pokemons.js";

export default class PlayState {
  enter(params) {
    this.player = new Player();
    this.poos = [];
    let pokemon = new Pokemon({
      pokemon: Pokemons.pokemons[params.starterID],
      player: this.player,
      poos: this.poos,
    });
    this.pokemons = [pokemon];
    this.cards = Pokemons.cards;
    this.stateMachine = new StateMachine({
      shop: new ShopState(this),
      game: new GameState(this),
    });
    this.changeState("game", this);
  }

  changeState(state, def) {
    this.stateMachine.change(state, def);
  }

  update(dt) {
    this.stateMachine.update(dt);
  }

  render() {
    this.stateMachine.render();
  }

  exit() {}
}
