import PokeIcon from "@/components/PokeIcon";
import { Coords, distance, Pokemon, State } from "@/constants/types/map";
import useMapItems from "@/hooks/useMapItems";
import usePokemonList from "@/hooks/usePokemonList";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
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
    if (!mapState)
        return <View style={styles.container}> <Text>Failed to load map</Text> </View>;

    return (
        <>
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
            <BottomTab 
                visible={isBottomTabVisible}
                handleSelect={onSelectPokemon}
                handleClose={() => setIsBottomTabVisible(false)}
            />
        </>
    );
}


// -----------------------------------
// Helper views - bottom selection tab
// -----------------------------------

// A component for pokemon selection
// - Scrollable list with PokeIcon items
function BottomTab({visible, handleSelect, handleClose}: any) {
    // Customizable component parameters
    const POKEMON_BATCH_SIZE = 16;      // Number of pokemons to load during each refresh
    const ICON_SIZE = 80;
    const ICON_MARGINS = {horizontal: 20, bottom: 40};

    // Component state
    const {pokemons, loading, loadMorePokemons} = usePokemonList(POKEMON_BATCH_SIZE);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <SafeAreaView style={styles.bottomTabContainer}>
                <Pressable 
                    onPress={handleClose} 
                    style={({ pressed }) => [
                        styles.closeButton,
                        pressed && styles.closeButtonPressed
                    ]}
                >
                    <Ionicons name="close" size={30} color={'black'} />
                </Pressable>
                <FlatList 
                    data={pokemons}
                    numColumns={Math.floor((Dimensions.get('window').width - 48) / (ICON_SIZE + ICON_MARGINS.horizontal * 2))}
                    renderItem={({item}) => <PokeIcon
                        pokemon={item}
                        dims={{size: ICON_SIZE, margins: ICON_MARGINS}}
                        handleClick={() => { handleSelect(item.name); handleClose(); }}
                    />}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => loadMorePokemons(POKEMON_BATCH_SIZE)}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} /> : null}
                    style={styles.bottomTabList}
                />
            </SafeAreaView>
        </Modal>
    );
}


// -------------------------
// Pokemon map view - styles
// -------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomTabContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 24,
        paddingTop: 60,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white"
    },
    bottomTabList: {
        width: "100%",
        paddingTop: 20
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: '#eee',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12
    },
    closeButtonPressed: {
        backgroundColor: '#ccc'
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});