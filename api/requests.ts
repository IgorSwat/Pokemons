import { Resource } from "@/types/common";
import { Pokemon } from "@/types/pokemon";


// --------------------------------
// Helper functions - fetching data
// --------------------------------

// Helper function - fetch a single pokemon data
export default async function fetchPokemon(nameOrId: string): Promise<Pokemon> {
    // A constant URL to Poke API with an addition of pokemon's name or ID
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;

    const result = await fetch(url);
    const pokemon = await result.json();

    return pokemon as Pokemon;
}

// Helper function - fetch multiple pokemons data
export async function fetchPokemons(namesOrIds: string[]): Promise<Pokemon[]> {
    const pokemons: (Pokemon | null)[] = await Promise.all(
        namesOrIds.map((nameOrId) => {
            try { return fetchPokemon(nameOrId) }
            catch (err) { console.log(err); return null; }          // If any error occured, we map index to a null value (which is eventualy removed later) instead of a Pokemon data
        })
    );

    // filter(Bollean) should remove any null / undefined values from an array
    return pokemons.filter(Boolean) as Pokemon[];
}

// Helper function - fetch pokemon names
// - The range is [offset, offset + limit)
export async function fetchPokemonNames(offset: number, limit: number): Promise<string[]> {
    // A constant URL for Poke API pokemon list invokation
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const result = await fetch(url);
    const data = await result.json();

    // Extract pokemon names into a separate array
    return data.results.map((item: Resource) => item.name);
}