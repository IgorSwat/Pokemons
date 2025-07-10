import { fetchPokemonNames, fetchPokemons } from "@/api/requests";
import { Pokemon } from "@/constants/types/pokemon";
import PokeEntry from "../../components/PokeEntry";

import useFavorite from "@/hooks/useFavorite";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet } from "react-native";


// -----------------
// Pokemon list view
// -----------------

// Customizable component parameters
const POKEMON_BATCH_SIZE = 16;      // Number of pokemons to load during each refresh

// Pokemon list main component
export default function Pokemons() {
    // Navigation state
    const router = useRouter();

    // Component state
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {favorite, } = useFavorite();

    // Step 1 - loading pokemon data from Poke API
    const loadMorePokemons = async () => {
        // Optimize realoding process by stopping unnecessary reloads when there is an already ongoing reload
        if (loading)
            return;

        // Mark the beginning of a loading process
        // - Only one reload available at time
        setLoading(true);

        const names = await fetchPokemonNames(pokemons.length, POKEMON_BATCH_SIZE);
        const data = await fetchPokemons(names);

        if (data && data.length > 0) {
            // Update data
            // - We use an arrow function to access previous state and build new state based on previous one
            setPokemons((prev) => [...prev, ...data]);
        }

        // Mark the end of loading process
        setLoading(false);
    };

    useEffect(() => {
        loadMorePokemons();
    }, []);

    // Step 2 - navigation between views
    // - We want to navigate to the pokemon view after clicking one of the list entries
    // - Save selected pokemon in async storage to render details tab easier
    const handleItemClick = async (item: Pokemon) => { 
        // Route to the details tab
        router.push({pathname: "../pokemon/[name]", params: {name: item.name}});
    };

    // Step 3 - render pokemon data with FlatList
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={pokemons}
                renderItem={({item}) => <PokeEntry pokemon={item} favorite={item.name === favorite?.name} handleClick={() => handleItemClick(item)} />}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMorePokemons}
                onEndReachedThreshold={0.3}
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