import { AppContext } from "@/context/AppContext";
import AppStorage from "@/storage/storage";
import { useContext, useEffect } from "react";
import usePokemon from "./usePokemon";


// ----------------
// UseFavorite hook
// ----------------

// A decorator for usePokemon() hook
// - One additional query to async storage before calling standard usePokemon hook
export default function useFavorite() {
    // Hook state
    // - favPokemonName is a global context variable shared among all insśtances of this hook
    // - This means using setFavPokemonName() in one instance will cause each other to update itselfś
    const {favPokemonName, setFavPokemonName} = useContext(AppContext);
    const favorite = usePokemon(favPokemonName);                                     // Re-use of usePokemon() component

    // Hook effect definition
    // - Applied at the component initialization stage
    // - Tries to load favPokemonName from async storage if global value from AppContext is not defined
    useEffect(() => {
        // Async wrapper for async storage access
        const loadFavorite = async () => {
            // There should be no need to load value again if it's already present in favPokemonName global variable
            if (favPokemonName)
                return;

            const name = await AppStorage.get("favorite") as (string | null);
            setFavPokemonName(name);    // We are fine if name is null
        };

        loadFavorite();
    }, []);

    // Favorite pokemon external setter
    // - A convenient way to update both favPokemonName from global context and async storage state (to persist data)
    const changeFavorite = (fav: string | null) => {
        if (fav !== favPokemonName) {
            // Step 1 - update global context variable
            setFavPokemonName(fav);

            // Step 2 - update async storage entry
            if (fav) AppStorage.set("favorite", fav);
            else  AppStorage.remove("favorite");
        }
    };

    // Return favorite pokemon data as well as setter for favorite pokemon
    return {favorite, changeFavorite};
}