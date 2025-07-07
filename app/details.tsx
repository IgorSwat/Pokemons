import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pokemon } from "../constants/types";
import AppStorage from "../storage/storage";
import PokeCard from "./components/PokeCard";

// --------------------
// Pokemon details view
// --------------------

export default function Details() {
    // Component state
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    // Step 1 - load selected pokemon
    // - We use async storage to obtain the information about which pokemon info should we display
    useEffect(() => {
        const loadPokemon = async () => {
            const selected = await AppStorage.get("selected") as Pokemon;

            if (selected)
                setPokemon(selected);
            else
                console.log("Error: lost info about selected pokemon");
        }

        loadPokemon();
    }, []);

    // Step 2 - render poke card
    return (
        <View style={styles.mainView}>
            {pokemon ? <PokeCard pokemon={pokemon} active={true}/> :
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