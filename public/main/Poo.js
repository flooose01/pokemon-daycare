import Util from "./Util.js";
import { SOUNDS } from "./constants.js";

export default class Poo {
  constructor(def) {
    this.block, this.clickable;
    this.generatePooBlock();
    this.pooExpireTime = 60;
    this.player = def.player;
    this.position = def.position;
    this.expired = false;
  }

  generatePooBlock() {
    let block = Util.gen("div");
    block.classList.add("poo-block");
    let img = Util.gen("img");

    img.src = "../img/poo.png";
    img.alt = "poo";
    block.addEventListener("click", () => {
      SOUNDS.sweep.play();
      block.remove();
      this.player.money += 100;
      this.expired = true;
    });
    img.classList.add("clickable");
    this.img = img;
    block.appendChild(img);
    Util.id("game").appendChild(block);
    block.style.cursor = "url(img/broom-cursor.png), auto";
    this.block = block;
  }

  update(dt) {
    this.pooExpireTime -= dt;
    if (this.pooExpireTime < 0) {
      this.block.remove();
      this.expired = true;
    }
  }

  render() {
    this.block.style.top = "calc(" + this.position.y + "% + 10vw)";
    this.block.style.left = "calc(" + this.position.x + "% + 5vw)";
  }
}
