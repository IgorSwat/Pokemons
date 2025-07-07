import { Pokemon, Resource } from "@/constants/types";
import PokeEntry from "../components/PokeEntry";

import AppStorage from "@/storage/storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";

// -----------------
// Pokemon list view
// -----------------

// Customizable component parameters
const POKEMON_LIST_MAX_SIZE = 16;

// Pokemon list main component
export default function Pokemons() {
    // Navigation state
    const router = useRouter();

    // Component state
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);

    // Step 1 - load pokemon data from Poke API
    // - TODO: remove list size limitations
    useEffect(() => {
        // Helper function - an async wrapper for loading data from Poke API
        const loadData = async () => {
            const names = await fetchPokemonNames(0, POKEMON_LIST_MAX_SIZE);
            const data = await fetchPokemons(names);
            if (data) {
                data.sort((a: Pokemon, b: Pokemon) => a.name.localeCompare(b.name));
                setPokemons(data);
            }
        };

        loadData();
    }, []);

    // Step 2 - navigation between views
    // - We want to navigate to the pokemon view after clicking one of the list entries
    // - Save selected pokemon in async storage to render details tab easier
    const handleItemClick = async (item: Pokemon) => { 
        // Save pokemon to async storage
        AppStorage.set("selected", item);

        // Route to the details tab
        router.push("/details");
    };

    // Step 3 - render pokemon data with FlatList
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={pokemons}
                renderItem={({item}) => <PokeEntry pokemon={item} handleClick={() => handleItemClick(item)} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
}


// --------------------------------
// Helper functions - fetching data
// --------------------------------

// Helper function - fetch a single pokemon data
async function fetchPokemon(nameOrId: string): Promise<Pokemon> {
    // A constant URL to Poke API with an addition of pokemon's name or ID
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;

    const result = await fetch(url);
    const pokemon = await result.json();

    return pokemon as Pokemon;
}

// Helper function - fetch multiple pokemons data
async function fetchPokemons(namesOrIds: string[]): Promise<Pokemon[]> {
    const pokemons: (Pokemon | null)[] = await Promise.all(
        namesOrIds.map((nameOrId) => {
            try { return fetchPokemon(nameOrId) }
            catch (err) { console.log(err); return null; }          // If any error occured, we map index to a null value (which is eventualy removed later) instead of a Pokemon data
        })
    );

    // filter(Bollean) should remove any null / undefined values from an array
    return pokemons.filter(Boolean) as Pokemon[];
}

// Helper function - fetch pokemon names
// - The range is [offset, offset + limit)
async function fetchPokemonNames(offset: number, limit: number): Promise<string[]> {
    // A constant URL for Poke API pokemon list invokation
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const result = await fetch(url);
    const data = await result.json();

    // Extract pokemon names into a separate array
    return data.results.map((item: Resource) => item.name);
}


// -----------------------------
// Pokemon list component styles
// -----------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1.
    },
});