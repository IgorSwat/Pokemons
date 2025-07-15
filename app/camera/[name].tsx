import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";


// -------------------
// Pokemon camera view
// -------------------

export default function PokeCam() {
    // Root parameters
    // - Obtain pokemon ID from root parameters of the URL screen path
    const { name } = useLocalSearchParams();

    // Component state
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice("back");

    // Navigation state
    const navigation = useNavigation();

    // Step 1 - request permissions and initialize component state
    useEffect(() => {
        if (!hasPermission)
            requestPermission();
    }, []);

    // Step 2 - render component

    // Additional layout issues
    useLayoutEffect(() => navigation.setOptions({title: "Camera"}), []);

    // Failure screen 1 - no camera permissions granted
    if (!hasPermission) {
        return (
            <View style={StyleSheet.absoluteFill}>
                <Text style={{fontSize: 20}}>No permissions to use camera</Text>
            </View>
        );
    }

    // Failure screen 2 - camera device error
    if (device == null) {
        return (
            <View style={[StyleSheet.absoluteFill, {flexDirection: "column"}]}>
                <Feather name="camera-off" size={80} color="#000" style={{marginBottom: 20}} />
                <Text style={{fontSize: 24, fontWeight: '600'}}>
                    Camera device unavailable
                </Text>
            </View>
        );
    }

    // Main screen - camera view
    return (
        <>
            <Camera 
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
        </>
    );
}


// ----------------------------
// Pokemon camera view - styles
// ----------------------------

const styles = StyleSheet.create({

});