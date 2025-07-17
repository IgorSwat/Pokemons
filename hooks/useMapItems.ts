import { Coords, distance, Pokemon } from "@/constants/types/map";
import { useEffect, useState } from "react";


// ----------------
// Common constants
// ----------------

const POSITION_CHANGE_THRESHOLD = 1e3;  // How much center position must change to trigger an update


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

    // 1. Hook state
    // -------------

    // Pokemon lists
    const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);              // Full list of pokemons (replace with async storage?)
    const [visiblePokemons, setVisiblePokemons] = useState<Pokemon[]>([]);      // Pokemons to render

    // Effective center
    // - Updates effective center only if we travel far enough from the old one
    // - This prevents reloading map item list too many times
    const [effCenter, setEffCenter] = useState<Coords | undefined>(undefined);

    // 2. Hook state reload
    // --------------------

    // Updating effective center
    useEffect(() => {
        if (!effCenter || center && distance(effCenter!, center) >= POSITION_CHANGE_THRESHOLD)
            setEffCenter(center);
    }, [center]);

    // Loading visible pokemons
    // - Refreshed each time either map state (position or scale) or all pokemons list changes
    useEffect(() => {
        const pokemonsInRange = effCenter && radius ? allPokemons.filter((item: Pokemon): boolean => (distance(effCenter, item.coords) < radius)) : 
                                                      allPokemons.slice();

        setVisiblePokemons(pokemonsInRange);
    }, [allPokemons, effCenter, radius]);

    // 3. Hook state handlers
    // ----------------------

    // State handler - adding new pokemon to the map
    const addPokemon = (pokemon: Pokemon): void => {
        // Since useEffect already deals with filtering visible pokemons, we can reduce the code to just updating the allPokemons list
        setAllPokemons((prevList) => [...prevList, pokemon]);
    };

    // 4. Hook return definition
    // -------------------------

    return { visiblePokemons, addPokemon };
}