import { DIALOG, SOUNDS, TOOL } from "../../constants.js";
import { gStateMachine } from "../../../index.js";

const TALK_TIME = 2;
const COOLDOWN = 2;
export default class PokemonIdleState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.idle;

  enter(def) {
    this.timer = TALK_TIME;
    this.cooldown = COOLDOWN;
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
    if (this.isTalking && this.cooldown == COOLDOWN) {
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
      this.cooldown = COOLDOWN;
      let dialog = this.pokemon.dialog;
      dialog.textContent =
        PokemonIdleState.dialog[
          parseInt(Math.random() * PokemonIdleState.dialog.length)
        ];
      this.isTalking = true;
      this.timer = TALK_TIME;
    }
  }

  changeToFull() {
    if (gStateMachine.state.tool == TOOL.food) {
      this.pokemon.changeState("full");
    } else if (gStateMachine.state.tool == TOOL.broom) {
      this.pokemon.changeState("sweep", { prev: "idle" });
    }
  }
}
