import { Coords, distance, Pokemon } from "@/constants/types/map";
import { useEffect, useState } from "react";

// ----------------
// UseMapItems hook
// ----------------

/* NOTES:
    - Using an internal pokemon list is only suitable for this small project
      In real, big-scale app there should be a separate backend with something like R-tree to store and load pokemon locations
    - TODO: Should persist data in something like async storage
*/

// A general hook for extracting all the pokemons pinned to the map
// - Allows to filter items based on given center of the map and maximal proximity radius (in metres)
export default function useMapItems({center, radius} : {center: Coords | undefined, radius: number | undefined}) {
    // Hook state
    const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);              // Full list of pokemons (replace with async storage?)
    const [visiblePokemons, setVisiblePokemons] = useState<Pokemon[]>([]);      // Pokemons to render

    // 1. Loading visible pokemons
    // ---------------------------

    // Refreshed each time either map state (position or scale) or all pokemons list changes
    useEffect(() => {
        const pokemonsInRange = center && radius ? allPokemons.filter((item: Pokemon): boolean => (distance(center, item.coords) < radius)) : 
                                                   allPokemons.slice();

        setVisiblePokemons(pokemonsInRange);
    }, [allPokemons, center, radius]);

    // 2. Hook state handlers
    // ----------------------

    // State handler - adding new pokemon to the map
    const addPokemon = (pokemon: Pokemon): void => {
        // Since useEffect already deals with filtering visible pokemons, we can reduce the code to just updating the allPokemons list
        setAllPokemons((prevList) => [...prevList, pokemon]);
    };

    // 3. Hook return definition
    // -------------------------

    return { visiblePokemons, addPokemon };
}