"use strict";
import Util from "./main/Util.js";
import GameState from "./main/GameState.js";

(function () {
  let now,
    dt = 0,
    last = Util.timestamp(),
    step = 1 / 60;

  window.addEventListener("load", start);

  function start() {
    GameState.change("start");
    window.requestAnimationFrame(loop);
  }

  // Update state, called every frame
  function update(dt) {
    GameState.update(dt);
  }

  // Render assets, called every frame
  function render() {
    GameState.render();
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
