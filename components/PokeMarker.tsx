import { Coords, Pokemon } from "@/constants/types/map";
import usePokemon from "@/hooks/usePokemon";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";


// ------------------------
// Pokemon marker component
// ------------------------

// A marker displayed on pokemon map inside the map tab
export default function PokeMarker({item, isSelected, select}: {item: Pokemon, isSelected: boolean, select: (pos: Coords | null) => void}) {
    // Component state
    // - Passing item.name only after marker has been selected prevents unnecessary fetches inside usePokemon hook,
    //   since we do not need to display pokemon's icon if the marker is not selected
    const pokemon = usePokemon( isSelected ? item.name as string : null);

    // Navigation state
    const router = useRouter();

    // Step 1 - render component
    return (
        <Marker
            coordinate={item.coords}
            title={item.name}
            onSelect={() => select(item.coords)}
            onDeselect={() => select(null)}
            onPress={() => {
                if (isSelected) router.push({pathname: "/pokemon/[name]", params: {name: item.name}});
            }}
        >
            <View style={styles.iconContainer}>
                {/* Weird stuff below, but at least it works... */}
                {/* TODO: split logic to simpler parts */}
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