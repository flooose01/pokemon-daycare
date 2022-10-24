import Util from "./util.js";
export default class Pokemon {
  constructor(pokemon) {
    this.id = pokemon.id; // id of pokemon in pokedex
    this.name = pokemon.species.name;
    this.hunger = 0; // hunger level, 100 = dead
    this.exp = 0; // 500 -> 1st evolve, 2000 -> 2nd evolve
    this.poo = 0; //
    this.img = pokemon.sprites.front_default;
    this.nextEvolve = 2;
  }

  static async make(id) {
    let pokemon = await Util.fetchURL(
      "https://pokeapi.co/api/v2/pokemon/" + id
    );
    return new Pokemon(pokemon);
  }
}
