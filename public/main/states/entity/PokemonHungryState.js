import { DIALOG, TOOL } from "../../constants.js";
import { gStateMachine } from "../../../index.js";

const TALK_TIME = 2;
const COOLDOWN = 1;
export default class PokemonHungryState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.hungry;

  enter(def) {
    this.timer = TALK_TIME;
    this.cooldown = COOLDOWN;
    this.isTalking = false;
    this.changeToFeed = this.changeToFeed.bind(this);
    this.pokemon.clickable.addEventListener("click", this.changeToFeed);
    this.pokemon.img.classList.add("hungry");
  }

  update(dt) {
    this.handleTalking(dt);
  }

  render() {
    if (this.isTalking) {
      this.pokemon.dialog.classList.remove("hidden");
    } else {
      this.pokemon.dialog.classList.add("hidden");
    }
  }

  exit() {
    this.pokemon.img.classList.remove("hungry");
    this.pokemon.clickable.removeEventListener("click", this.changeToFeed);
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
        PokemonHungryState.dialog[
          parseInt(Math.random() * PokemonHungryState.dialog.length)
        ];
      this.isTalking = true;
      this.timer = TALK_TIME;
    }
  }

  changeToFeed() {
    if (gStateMachine.state.tool == TOOL.food) {
      this.pokemon.changeState("feed");
    }
  }
}
