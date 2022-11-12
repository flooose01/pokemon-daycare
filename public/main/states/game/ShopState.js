import Util from "../../Util.js";
import { gStateMachine } from "../../../index.js";

export default class ShopState {
  constructor(game) {
    this.game = game;
  }

  enter(params) {
    Util.id("shop-container").classList.remove("hidden");
  }

  update(dt) {}

  render() {}

  exit() {
    Util.id("shop-container").classList.add("hidden");
  }
}
