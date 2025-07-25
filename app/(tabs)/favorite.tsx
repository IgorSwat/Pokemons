import PokeCard from "@/components/PokeCard";
import useFavorite from "@/hooks/useFavorite";
import { Pokemon } from "@/types/pokemon";
import { StyleSheet, Text, View } from "react-native";

// ---------------------
// Favorite pokemon view
// ---------------------

// TODO: Can details view be reused to replace this one?
export default function Favorite() {
    // Component state
    const {favoritePokemon, } = useFavorite();

    // Step 2 - render poke card
    // - If an error occured during fetching the data, display some dumb error text instead
    // - TODO: remove this test version
    return (
        <View style={styles.mainView}>
            {favoritePokemon ? <PokeCard pokemon={favoritePokemon as Pokemon} favorite={true}/> :
                               <Text style={{fontSize: 18}}>No favorite pokemon selected</Text>}
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