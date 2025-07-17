import PokeMarker from "@/components/PokeMarker";
import SelectionBottomTab from "@/components/SelectionBottomTab";
import useMapItems from "@/hooks/useMapItems";
import { Coords, Pokemon, State } from "@/types/map";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { LongPressEvent, MapPressEvent } from "react-native-maps";

import * as Location from 'expo-location';


// ----------------
// Common constants
// ----------------

const MAX_RENDER_RADIUS = 5e3;          // metres

const INITIAL_CENTER = { latitude: 50.049683, longitude: 19.944544 };   // Cracov coordinates
const INITIAL_SCALE = { latitudeDelta: 0.02, longitudeDelta: 0.01 };


// ----------------
// Pokemon map view
// ----------------

export default function PokeMap() {

    // 1. Component state
    // ------------------

    // Map activity
    // - Used to prevent some bugs related to unmounting the map after any tab change
    const [isActive, setIsActive] = useState<boolean>(false);   // Necessary to stop unmounting the component

    // Complete map state
    const [mapState, setMapState] = useState<State | undefined>(undefined);
    const lastClickCoords = useRef<Coords | null>(null);      // Keep track of user's last click coordinates

    // Visible & selected items (pokemons)
    const {visiblePokemons, addPokemon} = useMapItems({center: mapState?.center, radius: MAX_RENDER_RADIUS});
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);  // By marker ID

    // Bottom tab activity
    const [isBottomTabVisible, setIsBottomTabVisible] = useState<boolean>(false);

    // 2. Map state initialization
    // ---------------------------

    useEffect(() => {
        // Async wrapper for localization API
        // - Use expo-location to obtain current location coordinates
        // - San Francisco by default
        const getLocation = async (): Promise<Coords> => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') throw new Error("Permission to access location was denied");

            const location = await Location.getCurrentPositionAsync({});
            if (!location) throw new Error("Unable to load current location");
            
            return {latitude: location.coords.latitude, longitude: location.coords.longitude};
        };

        // Initialize map state
        getLocation()
            .then((pos: Coords) => {
                setMapState({ center: pos, scale: INITIAL_SCALE });
            })
            .catch((err: Error) => {
                console.log(`ERROR: ${err}`);
                setMapState({ center: INITIAL_CENTER, scale: INITIAL_SCALE });
            });
    }, []);

    // A side method to prevent unnecessary renders of the component and eliminate some bugs
    // - Keeping MapView active while being on another tab causes some weird issues with props and map state
    useFocusEffect(
        useCallback(() => {
            setIsActive(true);
            setSelectedMarker(null);
            return () => setIsActive(false);
        }, [])
    );

    // 2. Map state handlers
    // ---------------------

    // Update map state after each position change
    const onRegionChange = (region: any) => {
        setMapState({
            center: {latitude: region.latitude, longitude: region.longitude},
            scale: {latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta}
        });
    };

    // 3. Map click handlers
    // ---------------------

    // Main map click handler - short press
    // - Removes focus from any marker
    const onMapShortClick = (event: MapPressEvent): void => {
        lastClickCoords.current = event.nativeEvent.coordinate;

        // Remove selected marker (if exists) after clicking anywhere else on the map
        if (selectedMarker && event.nativeEvent.action !== "marker-press")
            setSelectedMarker(null);
    }

    // Main map click handler - long press
    // - Activates pokemon selection tab
    const onMapLongClick = (event: LongPressEvent): void => {
        lastClickCoords.current = event.nativeEvent.coordinate;

        setIsBottomTabVisible(true);
    };

    // Handle adding new pokemon after selection stage
    const onSelectPokemon = (name: string): void => {
        const pokemon = {
            // Marker's coordinates should be unique, so we can use it as an ID
            id: lastClickCoords.current!.latitude.toString() + lastClickCoords.current!.longitude.toString(),
            name: name, 
            coords: lastClickCoords.current!
        };

        addPokemon(pokemon);
    };

    // 4. Component JSX structure
    // --------------------------

    // Loading view
    if (!mapState || !isActive) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Main map view
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
                onPress={onMapShortClick}
                onLongPress={onMapLongClick}
                style={styles.container}
            >
                {visiblePokemons.map((pokemon: Pokemon) => (
                    <PokeMarker 
                        key={pokemon.id}
                        item={pokemon} 
                        isSelected={selectedMarker === pokemon.id}
                        select={(id: string | null) => setSelectedMarker(id)}
                    />
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
        justifyContent: "center",
        alignItems: "center",
    },
});