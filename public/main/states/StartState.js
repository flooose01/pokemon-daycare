import Util from "../Util.js";
import GameState from "../GameState.js";
import Pokemon from "../objects/Pokemon.js";

export default class StartState {
  static enter(def) {
    Util.id("volume").addEventListener("click", this.muteUnmute);
    this.getStarter();
  }

  static update(dt) {}

  static render() {}

  static async getStarter() {
    let bulbasaur = await Pokemon.make(1);
    let charmander = await Pokemon.make(4);
    let squirtle = await Pokemon.make(7);
    let starters = [bulbasaur, charmander, squirtle];
    for (let i = 0; i < starters.length; i++) {
      let img = Util.gen("img");
      img.src = starters[i].img;
      img.alt = starters[i].name;
      img.addEventListener("click", () => {
        this.start(starters[i]);
      });
      Util.id("starter").appendChild(img);
    }
  }

  static muteUnmute() {
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

  static start(starter) {
    Util.id("selection").innerHTML = "";
    Util.id("game-container").classList.remove("hidden");
    GameState.change("play", { pokemons: [starter] });
  }
}
