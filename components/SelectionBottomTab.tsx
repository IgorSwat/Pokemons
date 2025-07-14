import PokeIcon from "@/components/PokeIcon";
import usePokemonList from "@/hooks/usePokemonList";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Dimensions, FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";


// -----------------------
// Selection tab component
// -----------------------

// A component for pokemon selection in form of a bottom tab slider
// - Scrollable list with PokeIcon items
export default function SelectionBottomTab({visible, handleSelect, handleClose}: any) {
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
                <View style={styles.tabNavbar}>
                    <Text style={styles.tabText}>
                        Select pokemon
                    </Text>
                    <Pressable 
                        onPress={handleClose} 
                        style={({ pressed }) => [
                            styles.closeButton,
                            pressed && styles.closeButtonPressed
                        ]}
                    >
                        <Ionicons name="close" size={30} color={'black'} />
                    </Pressable>
                </View>
                <FlatList 
                    data={pokemons}
                    numColumns={Math.floor((Dimensions.get('window').width - 48) / (ICON_SIZE + ICON_MARGINS.horizontal * 2))}
                    renderItem={({item}) => <PokeIcon
                        pokemon={item}
                        handleClick={() => { handleSelect(item.name); handleClose(); }}
                        style={{
                            width: ICON_SIZE,
                            height: ICON_SIZE,
                            marginHorizontal: ICON_MARGINS.horizontal,
                            marginBottom: ICON_MARGINS.bottom
                        }}
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


// --------------------------------
// Selection tab component - styles
// --------------------------------

const styles = StyleSheet.create({
    bottomTabContainer: {
        width: "100%",
        height: "100%",
        padding: 24,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white"
    },
    tabNavbar: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    tabText: {
        fontSize: 24,
        paddingBottom: 10,
        fontWeight: '600'
    },
    closeButton: {
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
    },
    bottomTabList: {
        width: "100%",
        paddingTop: 20
    }
});