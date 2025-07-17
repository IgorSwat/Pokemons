// -------------------
// UsePokemonList hook
// -------------------

import { fetchPokemonNames, fetchPokemons } from "@/api/requests";
import { Pokemon } from "@/types/pokemon";
import { useEffect, useState } from "react";

// Provides given amount of pokemons (in the same order as in Poke API)
// - Can be dynamically extended or reduced in size by changing noPokemons prop
export default function usePokemonList(initialSize: number) {
    // Hook state
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Step 1 - loading pokemons & menaging pokemons list
    const loadMorePokemons = async (toLoad: number) => {
        // Optimize realoding process by stopping unnecessary reloads
        if (loading)
            return;

        // Mark the beginning of a loading process
        // - Only one reload available at time
        setLoading(true);

        const names = await fetchPokemonNames(pokemons.length, toLoad);
        const data = await fetchPokemons(names);

        if (data && data.length > 0) {
            // Update data
            // - We use an arrow function to access previous state and build new state based on previous one
            setPokemons((prev) => [...prev, ...data]);
        }

        // Mark the end of loading process
        setLoading(false);
    }

    useEffect(() => {
        loadMorePokemons(initialSize);
    }, []);

    const isLoading = () => loading == true;

    // Step 2 - return pokemon list & loader
    return {pokemons, loading, loadMorePokemons,};
}