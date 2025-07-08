import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { Pokemon } from "../constants/types";

// ----------------------
// Pokemon card component
// ----------------------

// Main component
export default function PokeCard({pokemon, favorite}: {pokemon: Pokemon, favorite: boolean}) {
    const cardStyles = favorite ? [styles.card, styles.favorite] : [styles.card];

    // Stage 1 - animation effects (for favorite pokemon card)
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    useEffect(() => {
        if (favorite) {
            Animated.loop(
                Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        } else {
            scaleAnim.setValue(1);
        }
    }, [favorite]);

    // Stage 2 - render PokeCard
    return (
        <Animated.View style={[...cardStyles, { transform: [{ scale: scaleAnim }] }]}>
            <Image 
                style={styles.sprite}
                source={{uri: pokemon.sprites.front_default}}
            />
            <Text style={styles.title}>
                {pokemon.name.toUpperCase()}
            </Text>
            <InfoLabel label="Base experience:" value={pokemon.base_experience.toString()} />
            <InfoLabel label="Height:" value={pokemon.height.toString()} />
            <InfoLabel label="Weight:" value={pokemon.weight.toString()} />
            <InfoLabel label="Order:" value={pokemon.order.toString()} />
            <InfoLabel 
                label="Abilities:" 
                value={pokemon.abilities.reduce((acc, item): string => acc + item.ability.name + " ", "")} 
            />
        </Animated.View>
    );
}


// --------------------------------------
// Helper components - pokemon info label
// --------------------------------------

// A helper component for displaying single entry of pokemon info (name, statistic or whatever)
function InfoLabel({label, value} : {label: string, value: string}) {
    return (
        <View style={styles.infoEntry}>
            <Text style={[styles.info, {fontWeight: '600'}]}>{label}</Text>
            <Text style={[styles.info, {marginLeft: 4}]}>{value}</Text>
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
        borderColor: '#FFD700',
        backgroundColor: '#fffbea',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 15,
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
    infoEntry: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 4
    },
    info: {
        fontSize: 16,
        color: '#555',
    },
});