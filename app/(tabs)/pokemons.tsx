import { fetchPokemonNames, fetchPokemons } from "@/api/requests";
import { Pokemon } from "@/constants/types";
import AppStorage from "@/storage/storage";
import PokeEntry from "../components/PokeEntry";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";

// -----------------
// Pokemon list view
// -----------------

// Customizable component parameters
const POKEMON_LIST_MAX_SIZE = 32;

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
                // Sort pokemons alphabetically by their names for better experience
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
        // - We do not need to clear this field, since it's always updated before going into details page
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


// -----------------------------
// Pokemon list component styles
// -----------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1.
    },
});