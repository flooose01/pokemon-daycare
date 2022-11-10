import Util from "./Util.js";

export default class Player {
  constructor() {
    this.money = 100;
    this.block = Util.id("money");
  }

  render() {
    this.block.textContent = "$" + this.money;
  }
}
