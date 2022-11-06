"use strict";
import Util from "./main/Util.js";
import StateMachine from "./main/StateMachine.js";
import PlayState from "./main/states/PlayState.js";
import StartState from "./main/states/StartState.js";

export const gStateMachine = new StateMachine({
  start: new StartState(),
  play: new PlayState(),
});

(function () {
  let now,
    dt = 0,
    last = Util.timestamp(),
    step = 1 / 60;

  window.addEventListener("load", start);

  function start() {
    gStateMachine.change("start");
    window.requestAnimationFrame(loop);
  }

  // Update state, called every frame
  function update(dt) {
    gStateMachine.update(dt);
  }

  // Render assets, called every frame
  function render() {
    gStateMachine.render();
  }

  function loop() {
    now = Util.timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while (dt > step) {
      dt = dt - step;
      update(step);
    }
    render(dt);
    last = now;
    window.requestAnimationFrame(loop);
  }
})();
