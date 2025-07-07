import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pokemon } from "../constants/types";
import AppStorage from "../storage/storage";
import PokeCard from "./components/PokeCard";


// --------------------
// Pokemon details view
// --------------------

export default function Details() {
    // Component state
    const navigation = useNavigation();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    // Step 1 - load selected pokemon and favorite pokemon data
    // - We use async storage to obtain the information about which pokemon info should we display
    // - TODO: This can certainely be done in a better way
    useEffect(() => {
        // Load selected pokemon info
        const loadPokemon = async () => {
            const selected = await AppStorage.get("selected") as Pokemon;
            if (selected)
                setPokemon(selected);
            else
                console.log("Error: lost info about selected pokemon");
        }

        // Load favorite pokemon info
        const loadFavorite = async () => {
            const favoritePokemon= await AppStorage.get("favorite") as Pokemon;
            if (pokemon && favoritePokemon && favoritePokemon.name === pokemon.name)
                setIsFavorite(true);
            else
                setIsFavorite(false);
        }

        loadPokemon();
        loadFavorite();
    }, [pokemon, isFavorite]);

    // Step 2 - render additional layout elements
    // - We use header button to allow user to choose pokemon as favorite
    // - User can have only 1 favorite pokemon (for now)

    // A handler for setting / removing a favorite pokemon
    const handleChangeFavorite = async () => {
        // Remember to update the async storage to properly track the global state
        if (isFavorite)
            AppStorage.remove("favorite");
        else 
            AppStorage.set("favorite", pokemon);

        setIsFavorite(!isFavorite);
    };

    // Render header button with an appropriate icon
    useLayoutEffect(() => {
        const iconName = isFavorite ? "heart-dislike-outline" : "heart-outline";

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleChangeFavorite} style={{ marginRight: 10 }}>
                    <Ionicons name={iconName} size={36} color="red" />
                </TouchableOpacity>
            ),
        });
    }, [pokemon, isFavorite]);

    // Step 3 - render poke card
    return (
        <View style={styles.mainView}>
            {pokemon ? <PokeCard pokemon={pokemon} favorite={isFavorite}/> :
                       <Text>Error loading pokemon</Text>}
        </View>
    );
}


// -----------------------------
// Pokemon details view - styles
// -----------------------------

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});