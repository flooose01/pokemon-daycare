import Util from "./Util.js";
import { GEN_ONE } from "./constants.js";

export default class Pokemons {
  // Returns an array of pokemons. Index of array is equal to id of pokemon
  static async make() {
    // Just some random pokemon for index 0.
    let pokemon_0 = await Util.fetchURL(
      "https://pokeapi.co/api/v2/pokemon/" + 17
    );
    let pokemons = [pokemon_0];
    for (let id = 1; id <= GEN_ONE; id++) {
      console.log("uploading...");
      let pokemon = await Util.fetchURL(
        "https://pokeapi.co/api/v2/pokemon/" + id
      );
      pokemons.push(pokemon);
    }
    return pokemons;
  }
}
