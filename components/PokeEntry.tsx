import { Colors } from "@/constants/Colors";
import { Pokemon } from "@/constants/types/pokemon";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// -----------------------
// Pokemon entry component
// -----------------------

// A component for displaying pokemon entry in main pokemons list view
// - The whole component works as a big button that navigates to given pokemon's view page
export default function PokeEntry({pokemon, favorite, handleClick}: {pokemon: Pokemon, favorite: boolean, handleClick: (e: any) => void}) {
    const defBackgroundColor = favorite ? 'gold' : 'white';
    
    return (
        <Pressable 
            onPress={handleClick}
            style={({pressed}) => [
                styles.container,
                {
                    backgroundColor: pressed ? Colors.light.tint : defBackgroundColor
                }
            ]}
        >
            <View style={styles.titleSection}>
                <Text style={styles.title}>
                    {pokemon.name.toUpperCase()}
                </Text>
                <Text style={styles.index}>
                    #{pokemon.id}
                </Text>
            </View>
            <Image
                source={{uri: pokemon.sprites.front_default}}
                style={styles.icon}
            />
        </Pressable>
    );
}


// --------------------
// Pokemon entry styles
// --------------------

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 64,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
    },
    titleSection: {
        minWidth: '30%',
        maxWidth: '60%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
    },
    index: {
        fontSize: 14,
        color: Colors.light.secondaryText,
    },
    icon: {
        height: "100%",
        width: 64
    }
});