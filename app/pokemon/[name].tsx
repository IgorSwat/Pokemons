import useFavorite from "@/hooks/useFavorite";
import usePokemon from "@/hooks/usePokemon";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PokeCard from "../../components/PokeCard";
import AppStorage from "../../storage/storage";


// --------------------
// Pokemon details view
// --------------------

export default function Details() {
    // Root parameters
    // - Obtain pokemon ID from root parameters of the URL screen path
    const { name } = useLocalSearchParams();

    // Component state
    const pokemon = usePokemon(name as string);
    const favPokemon = useFavorite();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const navigation = useNavigation();

    // Step 1 - load selected pokemon and favorite pokemon data
    // - We use async storage to obtain the information about which pokemon info should we display
    // - TODO: This can certainely be done in a better way
    useEffect(() => {
        if (pokemon && favPokemon)
            setIsFavorite(pokemon!.name === favPokemon!.name);
    }, [pokemon]);

    // Step 2 - render additional layout elements
    // - We use header button to allow user to choose pokemon as favorite
    // - User can have only 1 favorite pokemon (for now)

    // A handler for setting / removing a favorite pokemon
    const handleChangeFavorite = async () => {
        // Remember to update the async storage to properly track the global state
        if (isFavorite)
            AppStorage.remove("favorite");
        else 
            AppStorage.set("favorite", pokemon!.name);

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
            title: "Pokemon details"
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