import Util from "./Util.js";
import { GEN_ONE } from "./constants.js";
import PokemonCard from "./PokemonCard.js";

export default class Pokemons {
  // Returns an array of pokemons. Index of array is equal to id of pokemon
  static async make() {
    // Just some random pokemon for index 0.
    let pokemon_0 = await Util.fetchURL(
      "https://pokeapi.co/api/v2/pokemon/" + 17
    );
    let pokemons = [pokemon_0];
    let ids = [];
    let cards = [];
    let i = 1;
    for (let id = 1; id <= GEN_ONE; id++) {
      console.log("uploading...");
      i--;
      let pokemon = await Util.fetchURL(
        "https://pokeapi.co/api/v2/pokemon/" + id
      );
      if (i == 0) {
        let species = await Util.fetchURL(
          "https://pokeapi.co/api/v2/pokemon-species/" + id
        );
        let evolChainRaw = await Util.fetchURL(species.evolution_chain.url);
        let currEvolChain = evolChainRaw.chain.evolves_to;
        let evolChain = [id];

        while (currEvolChain.length > 0) {
          evolChain.push(
            parseInt(
              currEvolChain[0].species.url.split(
                "https://pokeapi.co/api/v2/pokemon-species/"
              )[1]
            )
          );
          currEvolChain = currEvolChain[0].evolves_to;
        }
        pokemon.evolChain = evolChain;
        i = evolChain.length;
        ids.push(id);
        let pokemonCard = new PokemonCard({
          id: id,
          name: pokemon.name,
          cost: (ids.length - 3) * 200,
          img: pokemon.sprites.front_default,
        });
        cards.push(pokemonCard);
      }
      pokemons.push(pokemon);
    }
    this.pokemons = pokemons;
    this.cards = cards;
  }

  static async fillShop() {
    let i = 3;
    while (i < Pokemons.cards.length) {
      let shopElt = Util.id("shop-container");
      let row = Util.gen("div");
      row.classList.add("row");
      let numInRow =
        Pokemons.cards.length - i >= 6 ? 6 : Pokemons.cards.length - i;
      for (let j = 0; j < numInRow; j++) {
        row.appendChild(Pokemons.cards[i].card);
        i++;
      }
      shopElt.appendChild(row);
    }
  }
}
