import Pokemons from "../../Pokemons.js";
import Util from "../../Util.js";
import Pokemon from "../../Pokemon.js";
import { SOUNDS } from "../../constants.js";

export default class ShopState {
  constructor(game) {
    this.shopModal = new bootstrap.Modal(Util.id("shop-modal"), {
      keyboard: false,
    });
    this.game = game;
    for (let i = 0; i < this.game.cards.length; i++) {
      let shopCard = this.game.cards[i];
      shopCard.card.addEventListener("click", () => {
        SOUNDS.kaching.play();
        this.game.player.money -= parseInt(shopCard.cost);
        let newPokemon = new Pokemon({
          pokemon: Pokemons.pokemons[shopCard.id],
          poos: this.game.poos,
          player: this.game.player,
        });

        this.game.pokemons.push(newPokemon);
        this.disableExpensiveCards();
      });
    }
  }

  enter(params) {
    this.shopModal.show();
    Util.id("close-btn").addEventListener("click", () => {
      this.game.changeState("game");
    });
    this.disableExpensiveCards();
  }

  update(dt) {}

  render() {}

  exit() {
    this.shopModal.hide();
  }

  disableExpensiveCards() {
    for (let i = 0; i < this.game.cards.length; i++) {
      if (this.game.cards[i].cost > this.game.player.money) {
        this.game.cards[i].card.classList.add("disabled");
      } else {
        this.game.cards[i].card.classList.remove("disabled");
      }
    }
  }
}
