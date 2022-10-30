import PlayState from "./states/PlayState.js";
import StartState from "./states/StartState.js";

export default class GameState {
  static STATES = {
    start: StartState,
    play: PlayState,
  };

  static change(state, def) {
    this.state = this.STATES[state];
    this.state.enter(def);
  }

  static update(dt) {
    this.state.update(dt);
  }

  static render() {
    this.state.render();
  }
}
