import AppStorage from "@/storage/storage";
import { useEffect, useState } from "react";
import usePokemon from "./usePokemon";


// ----------------
// UseFavorite hook
// ----------------

// A decorator for usePokemon() hook
// - One additional query to async storage before calling standard usePokemon hook
export default function useFavorite() {
    // Hook state
    const [favPokemonName, setFavPokemonName] = useState<string | null>(null);      // Triggers updates for pokemon data
    const pokemon = usePokemon(favPokemonName);                                     // Re-use of usePokemon() component

    // Hook effect definition
    // - Applied each time parent component reloads
    // - TODO: This is inefficient, bind it to anything to prevent updates after each render
    useEffect(() => {
        // Async wrapper for async storage access
        const loadFavorite = async () => {
            const name = await AppStorage.get("favorite") as string;

            if (name) setFavPokemonName(name);
            else setFavPokemonName(null);
        };

        loadFavorite();
    });

    // Return pokemon data as well as any potential errors (from usePokemon hook)
    return pokemon;
}