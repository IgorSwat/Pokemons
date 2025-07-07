import AppStorage from "@/storage/storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pokemon } from "../../constants/types";
import PokeCard from "../components/PokeCard";

// ---------------------
// Favorite pokemon view
// ---------------------

export default function Favorite() {
    // Component state
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    // Step 1 - fetch pokemon data
    // - useEffect() with an empty array [] results in fetching only once, after first render
    // - We utilize async storage to keep track of favorite pokemon
    useEffect(() => {
        const loadPokemon = async () => {
            // Get the favorite pokemon name
            const favoritePokemon = await AppStorage.get("favorite") as Pokemon;

            if (favoritePokemon)
                setPokemon(favoritePokemon);
            else
                setPokemon(null);
        }

        loadPokemon();
    });

    // Step 3 - render poke card
    // - If an error occured during fetching the data, display some dumb error text instead
    return (
        <View style={styles.mainView}>
            {pokemon ? <PokeCard pokemon={pokemon} favorite={pokemon != null}/> :
                       <Text>No favorite pokemon selected</Text>}
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