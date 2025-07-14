import { Pokemon } from "@/constants/types/map";
import usePokemon from "@/hooks/usePokemon";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";


// ------------------------
// Pokemon marker component
// ------------------------

// A marker displayed on pokemon map inside the map tab
export default function PokeMarker({item}: {item: Pokemon}) {
    // Component state
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const pokemon = usePokemon(item.name as string);

    // Navigation state
    const router = useRouter();

    // Step 1 - render component
    return (
        <Marker
            coordinate={item.coords}
            title={item.name}
            onSelect={() => setIsSelected(true)}
            onDeselect={() => setIsSelected(false)}
            onPress={() => {
                if (isSelected) router.push({pathname: "/pokemon/[name]", params: {name: item.name}});
            }}
        >
            <View style={styles.iconContainer}>
                {/* Weird stuff below, but at least it works... */}
                {isSelected && pokemon && (<ImageBackground source={{ uri: pokemon!.sprites.front_default }} style={styles.pokeImage} /> )}
                {(!isSelected || !pokemon) && (<ImageBackground source={require('@/assets/images/icons/poke-ball.png')} style={styles.pokeBall} />)}
            </View>
        </Marker>
    );
}


// ---------------------------------
// Pokemon marker component - styles
// ---------------------------------

const styles = StyleSheet.create({
    iconContainer: {
        width: 30,
        height: 30,
    },
    pokeBall:{
        width: 30,
        height: 30
    },
    pokeImage: {
        width: 50,
        height: 50,
    }
});