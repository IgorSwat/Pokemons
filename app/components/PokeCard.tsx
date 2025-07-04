import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Pokemon } from "../../storage/types";

// ----------------------
// Pokemon card component
// ----------------------

export default function PokeCard({pokemon}: {pokemon: Pokemon}) {
    useEffect(() => {
        console.log(pokemon.sprites.front_default);
    }, [])

    return (
        <View style={styles.card}>
            <Image 
                style={styles.sprite}
                source={{uri: pokemon.sprites.front_default}}
            />
            <Text style={styles.title}> {pokemon.name} </Text>
            <Text style={styles.info}> Base experience: {pokemon.base_experience} </Text>
            <Text style={styles.info}> Height: {pokemon.height} </Text>
            <Text style={styles.info}> Weight: {pokemon.weight} </Text>
            <Text style={styles.info}> Order: {pokemon.order} </Text>
        </View>
    );
}


// ------------------------------
// PokeCard component stylesheets
// ------------------------------

const styles = StyleSheet.create({
    card: {
        width: 200,
    },
    sprite: {
        alignSelf: 'center',
        width: 200,
        height: 200
    },
    title: {
        alignSelf: 'center',
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold'
    },
    info: {
        fontSize: 16
    }
});