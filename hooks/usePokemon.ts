import fetchPokemon from "@/api/requests";
import { Pokemon } from "@/constants/types/pokemon";
import { useEffect, useState } from "react";


// ---------------
// UsePokemon hook
// ---------------

// A helper hook for fetching a single pokemon data (by given name)
export default function usePokemon(name: string | null) {
    // Hook state
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    // Hook effect definition
    // - We can apply useEffect() to perform fetching pokemon's data each time there is a change in given name (when there is a need to load different pokemon)
    useEffect(() => {
        // A helper variable to prevent potential memory leaks when component gets unmounted
        let isCancelled = false;

        // Async wrapper for fetchPokemon() function
        const loadPokemon = async () => {
            const pokemon = await fetchPokemon(name!);

            if (!pokemon) throw new Error(`Failed to fetch pokemon of name ${name}`);
            if (!isCancelled) setPokemon(pokemon);
        };
        
        if (name != null)
            loadPokemon();
        else
            setPokemon(null);

        // This function is being returned each time parent component gets unmounted or useEffects re-applies again
        // - Since isCancelled is a local variable, after each re-run of useEffect it's value is being reset to false, so everything stays fine
        return () => { isCancelled = true; }
    }, [name]);

    // Return pokemon data as well as any potential errors
    return pokemon;
}