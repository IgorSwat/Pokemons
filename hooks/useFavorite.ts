import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import usePokemon from "./usePokemon";


// ----------------
// UseFavorite hook
// ----------------

// A decorator for usePokemon() hook
// - Combines with global context to provide favorite pokemon data
export default function useFavorite() {
    // Hook state
    // - favPokemonContext is a global context variable shared among all instances of this hook
    // - This means using setFavPokemonName() in one instance will cause each other to update itself
    const favPokemonContext = useContext(AppContext)!.favPokemonContext;
    const favoritePokemon = usePokemon(favPokemonContext.name);                                     // Re-use of usePokemon() component

    // Return favorite pokemon data as well as setter for favorite pokemon
    return {favoritePokemon, changeFavorite: favPokemonContext.change};
}