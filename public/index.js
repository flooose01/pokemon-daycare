"use strict";
import Pokemon from "./pokemon.js";
import Util from "./util.js";
import PlayState from "./PlayState.js";

(function () {
  let now,
    dt = 0,
    last = Util.timestamp(),
    step = 1 / 60;

  window.addEventListener("load", init);

  async function init() {
    Util.id("volume").addEventListener("click", muteUnmute);
    getStarter();
  }

  function start(starter) {
    Util.id("selection").innerHTML = "";
    Util.id("game-container").classList.remove("hidden");
    PlayState.enter({ pokemons: [starter] });
    window.requestAnimationFrame(loop);
  }

  function update(dt) {
    PlayState.update(dt);
  }

  function render(dt) {
    PlayState.render(dt);
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

  async function getStarter() {
    let bulbasaur = await Pokemon.make(1);
    let charmander = await Pokemon.make(4);
    let squirtle = await Pokemon.make(7);
    let starters = [bulbasaur, charmander, squirtle];
    for (let i = 0; i < starters.length; i++) {
      let img = Util.gen("img");
      img.src = starters[i].img;
      img.alt = starters[i].name;
      img.addEventListener("click", () => {
        start(starters[i]);
      });
      Util.id("starter").appendChild(img);
    }
  }
})();
