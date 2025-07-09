import React, { createContext, useState } from "react";


// -----------
// App context
// -----------

// Context type definition
type AppContextType = {
    favPokemonName: string | null;
    setFavPokemonName: (name: string | null) => void;
};

// Main context object
export const AppContext = createContext<AppContextType>({
    favPokemonName: null,
    setFavPokemonName: () => {}
});


// --------------------
// App context provider
// --------------------

export const AppProvider = ({ children} : any) => {
    // Global context - favorite pokemon (identified by name)
    // - If no pokemon is selected as favorite, then this value is equal to null
    const [favPokemonName, setFavPokemonName] = useState<string | null>(null);

    return (
        <AppContext.Provider value={{ favPokemonName, setFavPokemonName }}>
            {children}
        </AppContext.Provider>
    );
};