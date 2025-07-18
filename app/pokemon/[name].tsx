import useFavorite from "@/hooks/useFavorite";
import usePokemon from "@/hooks/usePokemon";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
    const {favoritePokemon, changeFavorite} = useFavorite();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    // Navigation state
    const router = useRouter();
    const navigation = useNavigation();

    // Step 1 - load and compare selected pokemon and favorite pokemon data
    useEffect(() => {
        if (pokemon && favoritePokemon)
            setIsFavorite(pokemon!.name === favoritePokemon!.name);
    }, [pokemon, favoritePokemon]);

    // Step 2 - render additional layout elements
    // - We use header button to allow user to choose pokemon as favorite
    // - User can have only 1 favorite pokemon (for now)

    // A handler for setting / removing a favorite pokemon
    const handleChangeFavorite = async () => {
        changeFavorite(!isFavorite ? pokemon!.name : null)
        setIsFavorite(!isFavorite);
    };

    // Move to camera view handler
    const handleOpenCamera = () => {
        router.push({pathname: "/camera/[name]", params: {name: name as string}});
    };

    // Step 3 - render header button with an appropriate icon
    useLayoutEffect(() => {
        if (pokemon) {
            const starIconName = isFavorite ? "star" : "star-outline";

            navigation.setOptions({
                headerRight: () => (
                    <View style={{flexDirection: "row", alignItems: "center"}} >
                        <TouchableOpacity onPress={handleOpenCamera} style={{marginHorizontal: 10}}>
                            <Ionicons name="camera" size={36} color="#333333" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleChangeFavorite}>
                            <Ionicons name={starIconName} size={36} color="gold" />
                        </TouchableOpacity>
                    </View>
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
});