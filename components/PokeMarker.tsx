import usePokemon from "@/hooks/usePokemon";
import { Pokemon } from "@/types/map";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";


// ------------------------
// Pokemon marker component
// ------------------------

// A marker displayed on pokemon map inside the map tab
export default function PokeMarker({item, isSelected, select}: {item: Pokemon, isSelected: boolean, select: (id: string | null) => void}) {

    // 1. Component state
    // ------------------

    // Passing item.name only after marker has been selected prevents unnecessary fetches inside usePokemon hook,
    // since we do not need to display pokemon's icon if the marker is not selected
    const pokemon = usePokemon( isSelected ? item.name as string : null);

    // Navigation state
    const router = useRouter();

    // 2. Component JSX structure
    // --------------------------

    // This is an uglier but preferable solution, since an alternative approach with conditionals inside 'source' prop leads to some weird behavior
    const icon = isSelected && pokemon ? <ImageBackground source={{ uri: pokemon!.sprites.front_default }} style={styles.pokeImage} /> :
                                         <ImageBackground source={require('@/assets/images/icons/poke-ball.png')} style={styles.pokeBall} />;

    return (
        <Marker
            coordinate={item.coords}
            title={item.name}
            onSelect={() => select(item.id)}
            onDeselect={() => select(null)}
            onPress={() => {
                if (isSelected) router.push({pathname: "/pokemon/[name]", params: {name: item.name}});
            }}
        >
            <View style={styles.iconContainer}>
                {icon}
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
        height: 30
    },
    pokeBall:{
        width: 30,
        height: 30
    },
    pokeImage: {
        width: 50,
        height: 50
    }
});