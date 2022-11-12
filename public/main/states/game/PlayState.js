import Util from "../../Util.js";
import { TOOL } from "../../constants.js";
import Player from "../../Player.js";
import Pokemon from "../../Pokemon.js";
import { GEN_ONE_POKEMONS } from "../../../index.js";
import StateMachine from "../../StateMachine.js";
import ShopState from "./ShopState.js";
import GameState from "./GameState.js";

export default class PlayState {
  enter(params) {
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
