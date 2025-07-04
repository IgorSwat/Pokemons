import AppStorage from "./storage";
import { Pokemon } from "./types";

// --------------------------------
// Helper functions - fetching data
// --------------------------------

// Fetches and returns pokemon data from pokeapi.co, adding to AsyncStorage as side effect
export default async function fetchAndStorePokemon(url: string) {
    const result = await fetch(url);
    const pokemon = await result.json();

    // Add fetched data to async storage
    await AppStorage.set(`pokemon/${pokemon.name}`, pokemon);

    return pokemon as Pokemon;
}