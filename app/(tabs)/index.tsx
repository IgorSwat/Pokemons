import { Pokemon } from "@/constants/types/pokemon";
import PokeEntry from "../../components/PokeEntry";

import useFavorite from "@/hooks/useFavorite";
import usePokemonList from "@/hooks/usePokemonList";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet } from "react-native";


// -----------------
// Pokemon list view
// -----------------

// Pokemon list main component
export default function Pokemons() {
    // Customizable component parameters
    const POKEMON_BATCH_SIZE = 16;      // Number of pokemons to load during each refresh

    // Navigation state
    const router = useRouter();

    // Component state
    const {pokemons, loading, loadMorePokemons} = usePokemonList(POKEMON_BATCH_SIZE);
    const {favoritePokemon, } = useFavorite();

    // Step 2 - navigation between views
    // - We want to navigate to the pokemon view after clicking one of the list entries
    // - Save selected pokemon in async storage to render details tab easier
    const handleItemClick = async (item: Pokemon) => { 
        // Route to the details tab
        router.push({pathname: "/pokemon/[name]", params: {name: item.name}});
    };

    // Step 3 - render pokemon data with FlatList
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={pokemons}
                renderItem={({item}) => <PokeEntry pokemon={item} favorite={item.name === favoritePokemon?.name} handleClick={() => handleItemClick(item)} />}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => loadMorePokemons(POKEMON_BATCH_SIZE)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} /> : null}
            />
        </SafeAreaView>
    );
}


// -------------------------------
// Pokemon list component - styles
// -------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1.
    },
});