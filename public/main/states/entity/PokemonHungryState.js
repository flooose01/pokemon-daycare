import { DIALOG, SOUNDS, TOOL } from "../../constants.js";
import { gStateMachine } from "../../../index.js";

const TALK_TIME = 2;
const COOLDOWN = 1;
const DEAD_THRESHOLD = 30;
export default class PokemonHungryState {
  constructor(pokemon) {
    this.pokemon = pokemon;
  }

  static dialog = DIALOG.hungry;

  enter(params) {
    this.isDying = false;
    this.deadTimer = 2;
    this.timer = TALK_TIME;
    this.cooldown = COOLDOWN;
    this.isTalking = false;
    this.changeToFeed = this.changeToFeed.bind(this);
    this.pokemon.clickable.addEventListener("click", this.changeToFeed);
    this.pokemon.img.classList.add("hungry");
  }

  update(dt) {
    this.handleTalking(dt);
    this.dieUpdate(dt);
  }

  render() {
    if (this.isTalking) {
      this.pokemon.dialog.classList.remove("hidden");
    } else {
      this.pokemon.dialog.classList.add("hidden");
    }
  }

  exit() {
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

  dieUpdate(dt) {
    if (this.pokemon.hunger > DEAD_THRESHOLD) {
      this.isDying = true;
      this.pokemon.block.classList.add("die");
    }

    if (this.isDying) {
      this.deadTimer -= dt;
    }

    if (this.deadTimer < 0) {
      SOUNDS.dead.play();
      this.pokemon.block.remove();
      this.pokemon.dead = true;
    }
  }

  changeToFeed() {
    if (gStateMachine.state.tool == TOOL.food) {
      SOUNDS.eat.play();
      this.pokemon.changeState("feed");
    } else if (gStateMachine.state.tool == TOOL.broom) {
      this.pokemon.changeState("sweep", { prev: "hungry" });
    }
  }
}
