import { Image, StyleSheet, Text, View } from "react-native";
import { AbilityInfo, Pokemon } from "../../constants/types";

// ----------------------
// Pokemon card component
// ----------------------

// Main component
export default function PokeCard({pokemon, favorite}: {pokemon: Pokemon, favorite: boolean}) {
    const cardStyles = favorite ? [styles.card, styles.favorite] : [styles.card];

    return (
        <View style={cardStyles}>
            <Image 
                style={styles.sprite}
                source={{uri: pokemon.sprites.front_default}}
            />
            <Text style={styles.title}>
                {pokemon.name.toUpperCase()}
            </Text>
            <Text style={styles.info}>
                <Text style={{fontWeight: '600'}}>Base experience:</Text> {pokemon.base_experience} </Text>
            <Text style={styles.info}>
                <Text style={{fontWeight: '600'}}>Height:</Text> {pokemon.height} </Text>
            <Text style={styles.info}>
                <Text style={{fontWeight: '600'}}>Weight:</Text> {pokemon.weight} </Text>
            <Text style={styles.info}>
                <Text style={{fontWeight: '600'}}>Order:</Text> {pokemon.order} </Text>
            <Text style={styles.info}>
                <Text style={{fontWeight: '600'}}>Abilities:</Text> {
                    pokemon.abilities.map((ability: AbilityInfo) => ability.ability.name + " ")
                }
            </Text>
        </View>
    );
}


// ------------------------------
// PokeCard component stylesheets
// ------------------------------

const styles = StyleSheet.create({
    card: {
        width: "80%",
        height: "auto",
        minHeight: "33%",
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
    favorite: {
        borderWidth: 2,
        borderColor: '#e91e63',
        backgroundColor: '#fff0f5',
        shadowColor: '#e91e63',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        transform: [{ scale: 1.05 }],
    },
    sprite: {
        alignSelf: 'center',
        width: "50%",
        height: 100,
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
        flexWrap: "wrap"
    },
});