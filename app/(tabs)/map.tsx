import { Coords, distance, Pokemon, State } from "@/constants/types/map";
import useMapItems from "@/hooks/useMapItems";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";


// ----------------
// Pokemon map view
// ----------------

export default function PokeMap() {
    // Constants
    const MAX_RENDER_RADIUS = 5e3;          // metres
    const POSITION_CHANGE_THRESHOLD = 1e3;  // How much center position must change to trigger an update

    // Component state
    // - effCenter is an effective center, which is used to obtain visible map markers and updated less frequently than real center
    const [mapState, setMapState] = useState<State | undefined>(undefined);
    const [effCenter, setEffCenter] = useState<Coords | undefined>(undefined);
    const {visiblePokemons, addPokemon} = useMapItems({center: effCenter, radius: MAX_RENDER_RADIUS});

    // Step 1 - component state initialization
    useEffect(() => {
        // Temporary, hardcoded version - pointing out Cracov
        // TODO: add initializing based on user's localization with something like Geolocation library
        const initialCenter = { latitude: 50.049683, longitude: 19.944544 };
        const initialScale = { latitudeDelta: 0.02, longitudeDelta: 0.01 };

        setMapState({center: initialCenter, scale: initialScale});
        setEffCenter(initialCenter);
    }, []);

    // Step 2 - map state handlers
    const onRegionChange = (region: any) => {
        const newCenter = {latitude: region.latitude, longitude: region.longitude};
        const newScale = {latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta};

        setMapState({
            center: newCenter,
            scale: newScale
        });

        // Update effective center only if we travel far enough from the old one
        // - This prevents reloading map items list too many times
        if (distance(effCenter!, newCenter) >= POSITION_CHANGE_THRESHOLD)
            setEffCenter(newCenter);
    };

    // Step 3 - map click handlers
    // - Add a dumb pokemon data
    const onMapClick = (event: MapPressEvent): void => {
        // This is temporary, the goal is to create a bottom tab screen which would allow to select a pokemon
        const pokemon = {name: "Pikachu", coords: event.nativeEvent.coordinate};

        addPokemon(pokemon);
    }

    // Step 4 - render map component
    if (!mapState)
        return <View style={styles.container}> <Text>Failed to load map</Text> </View>;

    return (
        <MapView 
            userInterfaceStyle="light"
            mapType="terrain"
            initialRegion={{
                ...mapState.center,
                ...mapState.scale
            }}
            onRegionChange={onRegionChange}
            onPress={onMapClick}
            style={styles.container}
        >
            {visiblePokemons.map((pokemon: Pokemon, idx: number) => (
                <Marker
                    key={idx}
                    coordinate={pokemon.coords}
                    title={pokemon.name}
                    image={require("@/assets/images/icons/poke-ball.png")}
                />
            ))}
        </MapView>
    );
}


// -------------------------
// Pokemon map view - styles
// -------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});