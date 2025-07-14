import PokeMarker from "@/components/PokeMarker";
import SelectionBottomTab from "@/components/SelectionBottomTab";
import { Coords, distance, Pokemon, State } from "@/constants/types/map";
import useMapItems from "@/hooks/useMapItems";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent } from "react-native-maps";


// ----------------
// Pokemon map view
// ----------------

export default function PokeMap() {
    // Constants
    const MAX_RENDER_RADIUS = 5e3;          // metres
    const POSITION_CHANGE_THRESHOLD = 1e3;  // How much center position must change to trigger an update

    // Component state
    // - effCenter is an effective center, which is used to obtain visible map markers and updated less frequently than real center
    const [isActive, setIsActive] = useState<boolean>(false);   // Necessary to stop unmounting the component

    const [mapState, setMapState] = useState<State | undefined>(undefined);
    const [effCenter, setEffCenter] = useState<Coords | undefined>(undefined);

    const {visiblePokemons, addPokemon} = useMapItems({center: effCenter, radius: MAX_RENDER_RADIUS});

    const [isBottomTabVisible, setIsBottomTabVisible] = useState<boolean>(false);

    const lastClickCoords = useRef<Coords | null>(null);      // Keep track of user's last click coordinates

    // Step 1 - component state initialization
    useEffect(() => {
        // Temporary, hardcoded version - pointing out Cracov
        // TODO: add initializing based on user's localization with something like Geolocation library
        const initialCenter = { latitude: 50.049683, longitude: 19.944544 };
        const initialScale = { latitudeDelta: 0.02, longitudeDelta: 0.01 };

        setMapState({center: initialCenter, scale: initialScale});
        setEffCenter(initialCenter);
    }, []);

    // A side method to prevent unnecessary renders of the component and eliminate some bugs
    // - Keeping MapView active while being on another tab causes some weird issues with props and map state
    useFocusEffect(
        useCallback(() => {
            setIsActive(true);
            return () => setIsActive(false);
        }, [])
    );

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

    // Main map click handler
    // - Different behavior depending on what has been clicked (marker, map, ...)
    const onMapClick = (event: MapPressEvent): void => {
        // Save click coordinates
        lastClickCoords.current = event.nativeEvent.coordinate;

        // Omit marker clicks for now
        // TODO: display a small screen showing pokemon corresponding to the marker
        if (event.nativeEvent.action === "marker-press")
            return;

        setIsBottomTabVisible(true);
    }

    // Handle adding new pokemon after selection stage
    const onSelectPokemon = (name: string): void => {
        const pokemon = {name: name, coords: lastClickCoords.current!};
        addPokemon(pokemon);
    };

    // Step 4 - render map component
    // TODO: Huge issue - after changing the tab, the map not only forgets it's initialRegion, but also disconnects any handlers
    if (!mapState || !isActive)
        return <View style={styles.container}> <Text>Failed to load map</Text> </View>;

    return (
        <>
            <MapView
                provider="google"
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
                    <PokeMarker key={idx} item={pokemon} />
                ))}
            </MapView>
            <SelectionBottomTab 
                visible={isBottomTabVisible}
                handleSelect={onSelectPokemon}
                handleClose={() => setIsBottomTabVisible(false)}
            />
        </>
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