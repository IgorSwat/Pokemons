import useFavorite from "@/hooks/useFavorite";
import usePokemon from "@/hooks/usePokemon";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PokeCard from "../../components/PokeCard";


// --------------------
// Pokemon details view
// --------------------

export default function Details() {
    // Root parameters
    // - Obtain pokemon ID from root parameters of the URL screen path
    const { name } = useLocalSearchParams();

    // Component state
    const pokemon = usePokemon(name as string);
    const {favorite, changeFavorite} = useFavorite();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const navigation = useNavigation();

    // Step 1 - load and compare selected pokemon and favorite pokemon data
    useEffect(() => {
        if (pokemon && favorite)
            setIsFavorite(pokemon!.name === favorite!.name);
    }, [pokemon, favorite]);

    // Step 2 - render additional layout elements
    // - We use header button to allow user to choose pokemon as favorite
    // - User can have only 1 favorite pokemon (for now)

    // A handler for setting / removing a favorite pokemon
    const handleChangeFavorite = async () => {
        changeFavorite(!isFavorite ? pokemon!.name : null)
        setIsFavorite(!isFavorite);
    };

    // Step 3 - render header button with an appropriate icon
    useLayoutEffect(() => {
        if (pokemon) {
            const iconName = isFavorite ? "star" : "star-outline";

            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={handleChangeFavorite} style={styles.starButton}>
                        <Ionicons name={iconName} size={36} color="gold" />
                    </TouchableOpacity>
                ),
                title: "Pokemon details"
            });
        }
    }, [pokemon, isFavorite]);

    // Step 4 - render poke card
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
    starButton: {
        marginRight: 10,
    }
});