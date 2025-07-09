import { StyleSheet } from "react-native";
import MapView from "react-native-maps";


// ----------------
// Pokemon map view
// ----------------

export default function PokeMap() {
    return (
        <MapView 
            initialRegion={{
                latitude: 50.049683,
                longitude: 19.944544,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0431
            }}
            style={styles.container}
        />
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