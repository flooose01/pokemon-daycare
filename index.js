"use strict";
import Pokemon from "./pokemon.js";
import Util from "./util.js";

(function () {
  let now,
    dt = 0,
    last = Util.timestamp(),
    step = 1 / 60;

  window.addEventListener("load", init);

  function init() {
    Util.id("volume").addEventListener("click", muteUnmute);
    loadStarters();
    window.requestAnimationFrame(loop);
  }

  function update() {}

  function render() {}

  async function loadStarters() {
    let bulbasaur = await Pokemon.make(1);
    let charmander = await Pokemon.make(4);
    let squirtle = await Pokemon.make(7);
    let starter = [bulbasaur, charmander, squirtle];
    console.log(starter);
    for (let i = 0; i < starter.length; i++) {
      let img = Util.gen("img");
      img.src = starter[i].img;
      img.alt = starter[i].name;
      img.addEventListener("click", () => {
        startGame();
      });
      Util.id("starter").appendChild(img);
    }
  }

  function muteUnmute() {
    let vol = Util.id("volume");
    let audio = Util.qs("audio");
    if (vol.classList.contains("mute")) {
      vol.classList.remove("mute");
      vol.src = "img/volume.png";
      vol.alt = "speaker";
      audio.play();
    } else {
      vol.classList.add("mute");
      vol.src = "img/mute.png";
      vol.alt = "mute";
      audio.pause();
    }
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
