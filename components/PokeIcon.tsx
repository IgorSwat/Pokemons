import { Pokemon } from "@/constants/types/pokemon";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";


// ----------------------
// Pokemon icon component
// ----------------------

// Represents a pressable icon with customizable size and tooltip
export default function PokeIcon({ pokemon, dims, handleClick }: { pokemon: Pokemon, dims: PokeIconSize, handleClick: () => void }) {
    // Component state
    const [isPressed, setPressed] = useState(false);
    const [isLongPressed, setIsLongPressed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Step 1 - button click handling functions
    const onPressIn = () => { setPressed(true); };

    const onPressOut = () => {
        // Do not activate handleClick() in case of a long press
        if (!isLongPressed)
            handleClick();

        // Reset both tooltip and button click state
        setShowTooltip(false);
        setPressed(false);
        setIsLongPressed(false);
    };

    const onLongPress = () => {
        // Mark press as a long one
        setIsLongPressed(true);
        setShowTooltip(true);
    };

    // Step 2 - render component
    return (
        <View style={styles.centered}>
            {showTooltip && (
                <Text style={styles.tooltip}>{pokemon.name.toUpperCase()}</Text>
            )}
            <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onLongPress={onLongPress}
                delayLongPress={300}
                style={({ pressed }) => [
                    styles.iconContainer,
                    {
                        width: dims.size,
                        height: dims.size,
                        borderRadius: dims.size * 0.2,
                        marginLeft: dims.margins.horizontal,
                        marginRight: dims.margins.horizontal,
                        marginBottom: dims.margins.bottom
                    },
                    pressed || isPressed ? styles.iconPressed : styles.iconDefault
                ]}
            >
                <Image
                    style={styles.sprite}
                    source={{ uri: pokemon.sprites.front_default }}
                />
            </Pressable>
        </View>
    );
}


// -----------------------------------
// Pokemon icon component - prop types
// -----------------------------------

export interface PokeIconSize {
    size: number;
    margins: {
        horizontal: number;
        bottom: number;
    };
};


// -------------------------------
// Pokemon icon component - styles
// -------------------------------

const styles = StyleSheet.create({
    centered: {
        position: "relative",
        alignItems: "center"
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    iconDefault: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    iconPressed: {
        backgroundColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 2
    },
    sprite: {
        alignSelf: "center",
        width: "100%",
        height: "100%"
    },
    tooltip: {
        position: "absolute",
        top: -28,
        marginBottom: 6,
        backgroundColor: "rgba(0,0,0,0.75)",
        color: "white",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12
    }
});
