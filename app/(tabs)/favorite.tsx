import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pokemon } from "../../constants/types";
import fetchAndStorePokemon from "../../storage/fetch";
import AppStorage from "../../storage/storage";
import PokeCard from "../components/PokeCard";

// ---------------------
// Favorite pokemon view
// ---------------------

export default function Favorite() {
    // Component state
    const navigation = useNavigation();
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

    // Step 2 - handle unmarking the pokemon
    // - Includes rendering a header button and handling the button clicked event
    const handleUnliked = () => { setHasFavorite(!hasFavorite); }

    useLayoutEffect(() => {
        const iconName = hasFavorite ? "heart-dislike-outline" : "heart-outline";

        navigation.setOptions({
            headerRight: () => (
            <TouchableOpacity onPress={handleUnliked} style={{ marginRight: 10 }}>
                <Ionicons name={iconName} size={36} color="red" />
            </TouchableOpacity>
            ),
        });
    }, [navigation, hasFavorite]);

    // Step 3 - render poke card
    // - If an error occured during fetching the data, display some dumb error text instead
    return (
        <View style={styles.mainView}>
            {pokemon ? <PokeCard pokemon={pokemon} active={hasFavorite}/> :
                       <Text>Error loading pokemon</Text>}
        </View>
    );
}


// ------------------------------
// Favorite pokemon view - styles
// ------------------------------

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});