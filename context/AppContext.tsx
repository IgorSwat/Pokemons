import AppStorage from "@/storage/storage";
import React, { createContext, JSX, useEffect, useState } from "react";


// -------------------------
// App context - definitions
// -------------------------

// Main app context
// - So far it only consists of favorite pokemon context, but might be extended in the future
export interface AppContextType {
    favPokemonContext: FavoritePokemonContext;
};

// Context element - favorite pokemon
export interface FavoritePokemonContext {
    name: string | null;                        // Possibly null if there is no favorite pokemon selected
    change: (name: string | null) => void;
};


// --------------------
// App context providerś
// --------------------

// Context shared object
export const AppContext = createContext<AppContextType | null>(null);

// Context provider
export const AppProvider = ({children} : {children: JSX.Element[]}): JSX.Element => {

    // 1. Context provider state
    // -------------------------

    // Global context - favorite pokemon (identified by name)
    const [favPokemonName, setFavPokemonName] = useState<string | null>(null);

    // 2. Context state initialization
    // -------------------------------

    //  Synchronize with the async storage after the first render
    useEffect(() => {
        // Async wrappers for async storage access
        const loadFavorite = async (): Promise<void> => {
            // We can fully rely on async storage, since favPokemonName is always null at the beginning of app lifetime
            const name = await AppStorage.get("favorite") as (string | null);
            setFavPokemonName(name);
        };

        // Initialize context state
        loadFavorite();                 // Favorite pokemon context
    }, []);

    // 3. Context state handlers
    // -------------------------

    // Favorite pokemon context - changing favorite pokemon handler
    const handleChangeFavorite = (newFavorite: string | null): void => {
        console.log("Inside handleChangeFavorite");
        if (newFavorite !== favPokemonName) {
            // Update global context value
            setFavPokemonName(newFavorite);

            // Update async storage
            if (newFavorite != null) AppStorage.set("favorite", newFavorite);
            else AppStorage.remove("favorite");
        }
    };

    // 4. Component JSX structure
    // --------------------------

    return (
        <AppContext.Provider 
            value={{ 
                favPokemonContext: {name: favPokemonName, change: handleChangeFavorite}
            }}>
            {children}
        </AppContext.Provider>
    );
};