import { useEffect, useState } from "react";
import { Text } from "react-native";
import fetchAndStorePokemon from "../../storage/fetch";
import AppStorage from "../../storage/storage";
import { Pokemon } from "../../storage/types";
import PokeCard from "../components/PokeCard";

// ---------------------
// Favorite pokemon view
// ---------------------

export default function Favorite() {
    // Component state
    const [hasFavorite, setHasFavorite] = useState<boolean>(true);
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    // Temporary, hardcoded version
    // TODO: remove in the future
    const pokemonName = "clefairy";
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    // Step 1 - fetch pokemon data
    // - useEffect() with an empty array [] results in fetching only once, after first render
    // - AppStorage can be utilized to store data and prevent unnecessary fetches
    useEffect(() => {
        const loadPokemon = async () => {
            // Try to extract the cached data first if available
            const cached = await AppStorage.get(`pokemon/${pokemonName}`) as Pokemon;
            if (cached)
                setPokemon(cached);
            else {
                const fresh = await fetchAndStorePokemon(url) as Pokemon;
                setPokemon(fresh);
            }
        }

        loadPokemon();
    }, []);

    // Step 2 - render poke card
    if (hasFavorite && pokemon) {
        return (
            <PokeCard pokemon={pokemon}/>
        );
    }
    else {
        return (
            <Text>No i ni ma pokemona :(</Text>
        );
    }
}