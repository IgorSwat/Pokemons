import { Coords, distance, Pokemon } from "@/constants/types/map";
import { useEffect, useState } from "react";

// ----------------
// UseMapItems hook
// ----------------

// A general hook for extracting all the pokemons pinned to the map
// - Allows to filter items based on given center of the map and maximal proximity radius (in metres)
export default function useMapItems({center, radius} : {center: Coords | undefined, radius: number | undefined}) {
    // Hook state
    const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);              // Full list of pokemons (replace with async storage?)
    const [visiblePokemons, setVisiblePokemons] = useState<Pokemon[]>([]);      // Pokemons to render

    // Step 1 - load visible pokemons
    // - Refreshed each time map state (position or scale) changes
    // - TODO: add extracting data from async storage
    useEffect(() => {
        const pokemonsInRange = center && radius ? allPokemons.filter((item: Pokemon): boolean => (distance(center, item.coords) < radius)) : allPokemons.slice();
        setVisiblePokemons(pokemonsInRange);
    }, [center, radius]);

    // Step 2 - adding new pokemon to the map
    // - External function, called outside the hook each time a new pokemon is added
    // - TODO: add persisting data in async storage
    const addPokemon = (pokemon: Pokemon): void => {
        // First, add pokemon to the full list
        setAllPokemons((prevList) => [...prevList, pokemon]);

        // If the pokemon is inside the render area, add it to filtered list
        if (!center || !radius || distance(center, pokemon.coords) < radius)
            setVisiblePokemons((prevList) => [...prevList, pokemon]);
    };

    // Step 3 - return visible pokemons and external addPokemon setter
    return { visiblePokemons, addPokemon };
}