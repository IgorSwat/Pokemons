import { Image, StyleSheet, Text, View } from "react-native";
import { Pokemon } from "../../storage/types";

// ----------------------
// Pokemon card component
// ----------------------

// Main component
export default function PokeCard({pokemon, active}: {pokemon: Pokemon, active: boolean}) {
    const cardStyles = active ? [styles.card] : [styles.card, styles.disabled];

    return (
        <View style={cardStyles}>
            <Image 
                style={styles.sprite}
                source={{uri: pokemon.sprites.front_default}}
            />
            <Text style={styles.title}> {pokemon.name.toUpperCase()} </Text>
            <PokeCardDescription pokemon={pokemon} />
        </View>
    );
}


// ------------------------------------
// Helper components - card description
// ------------------------------------

// A separate component to display detailed pokemon information and statistics
// - Can be easily disabled to reduce the size of a PokeCard
function PokeCardDescription({pokemon}: {pokemon: Pokemon}) {
    return (
        <>
            <Text style={styles.info}> Base experience: {pokemon.base_experience} </Text>
            <Text style={styles.info}> Height: {pokemon.height} </Text>
            <Text style={styles.info}> Weight: {pokemon.weight} </Text>
            <Text style={styles.info}> Order: {pokemon.order} </Text>
        </>
    )
}


// ------------------------------
// PokeCard component stylesheets
// ------------------------------

const styles = StyleSheet.create({
    card: {
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    disabled: {
        opacity: 0.3,
        elevation: 0
    },
    sprite: {
        alignSelf: 'center',
        width: 120,
        height: 120,
        marginBottom: 12,
    },
    title: {
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    info: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
});