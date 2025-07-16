import PokeMarker from "@/components/PokeMarker";
import SelectionBottomTab from "@/components/SelectionBottomTab";
import { Coords, distance, equals, Pokemon, State } from "@/constants/types/map";
import useMapItems from "@/hooks/useMapItems";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { LongPressEvent, MapPressEvent } from "react-native-maps";

import * as Location from 'expo-location';


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
    // TODO: Move to useMapItems hook
    const [effCenter, setEffCenter] = useState<Coords | undefined>(undefined);

    const {visiblePokemons, addPokemon} = useMapItems({center: effCenter, radius: MAX_RENDER_RADIUS});
    // TODO: Add ID to Pokemon structure
    const [selectedMarker, setSelectedMarker] = useState<Coords | null>(null);

    const [isBottomTabVisible, setIsBottomTabVisible] = useState<boolean>(false);

    const lastClickCoords = useRef<Coords | null>(null);      // Keep track of user's last click coordinates

    // Step 1 - component state initialization
    useEffect(() => {
        // Cracov coordinates
        let initialCenter = { latitude: 50.049683, longitude: 19.944544 };
        let initialScale = { latitudeDelta: 0.02, longitudeDelta: 0.01 };

        // Async wrapper for localization API
        // - Use expo-location to obtain current location coordinates
        // - San Francisco by default (?)
        // - TODO: Always return default location
        const getLocation = async (): Promise<Coords | void> => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log("Error: permission to access location was denied");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            
            return {latitude: location.coords.latitude, longitude: location.coords.longitude};
        };

        getLocation().then(location => {
            if (location) initialCenter = location;
            else console.log("Setting up Cracov instead...");

            setMapState({center: initialCenter, scale: initialScale});
            setEffCenter(initialCenter);
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
        const pokemon = {name: name, coords: lastClickCoords.current!};
        addPokemon(pokemon);
    };

    // Step 4 - render map component
    if (!mapState || !isActive) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

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
                {visiblePokemons.map((pokemon: Pokemon, idx: number) => (
                    <PokeMarker 
                        key={idx}   // TODO: Do not use array index as a key
                        item={pokemon} 
                        isSelected={(selectedMarker && equals(selectedMarker!, pokemon.coords)) as boolean}
                        select={(pos: Coords | null) => setSelectedMarker(pos)}
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