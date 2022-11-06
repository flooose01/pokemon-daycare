import { DIALOG, TOOL } from "../../constants.js";
import { gStateMachine } from "../../../index.js";

export default class PokemonIdleState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.idle;

  enter(def) {
    this.timer = 2;
    this.cooldown = 1;
    this.isTalking = false;
    this.changeToFull = this.changeToFull.bind(this);
    this.pokemon.clickable.addEventListener("click", this.changeToFull);
  }

  update(dt) {
    this.handleTalking(dt);

    if (this.pokemon.isHungry()) {
      this.pokemon.changeState("hungry");
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
    this.pokemon.dialog.classList.add("hidden");
    this.pokemon.clickable.removeEventListener("click", this.changeToFull);
  }

  handleTalking(dt) {
    if (this.isTalking && this.cooldown == 1) {
      // timer countdown
      this.timer -= dt;
      if (this.timer < 0) {
        // stop talking
        this.isTalking = false;
      }
    } else if (!this.isTalking && this.cooldown > 0) {
      // counting down cooldown
      this.cooldown -= dt;
    } else if (!this.isTalking && this.cooldown <= 0) {
      // cooldown expire and start talking
      this.cooldown = 1;
      let dialog = this.pokemon.dialog;
      dialog.textContent =
        PokemonIdleState.dialog[
          parseInt(Math.random() * PokemonIdleState.dialog.length)
        ];
      this.isTalking = true;
      this.timer = 2;
    }
  }

  changeToFull() {
    if (gStateMachine.state.tool == TOOL.food) {
      this.pokemon.changeState("full");
    }
  }
}
