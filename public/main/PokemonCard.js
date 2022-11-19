import Util from "./Util.js";

export default class PokemonCard {
  constructor(def) {
    this.cost = def.cost;
    this.name = def.name;
    this.id = def.id;
    this.img = def.img;
    this.card = this.genCard();
  }

  genCard() {
    let div = Util.gen("div");
    let img = Util.gen("img");
    let h5 = Util.gen("h5");
    let hr = Util.gen("hr");
    let p = Util.gen("p");
    div.classList.add(...["card", "col-4", "col-sm-2"]);
    img.src = this.img;
    img.classList.add(
      ...["card-img-top", "img-fluid", "rounded", "mx-auto", "d-block"]
    );
    h5.classList.add(...["card-title", "text-center"]);
    p.classList.add(...["card-text", "text-center"]);

    h5.textContent = this.name;
    p.textContent = "$" + this.cost;

    div.appendChild(img);
    div.appendChild(h5);
    div.appendChild(hr);
    div.appendChild(p);
    return div;
  }
}
