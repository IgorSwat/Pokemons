import usePokemon from "@/hooks/usePokemon";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { CameraPosition, Frame, useCameraDevice, useCameraPermission, Camera as VisionCamera } from "react-native-vision-camera";
import { Bounds, Camera, Face, FaceDetectionOptions } from "react-native-vision-camera-face-detector";


// -------------------
// Pokemon camera view
// -------------------

export default function PokeCam() {
    // Root parameters
    // - Obtain pokemon ID from root parameters of the URL screen path
    const { name } = useLocalSearchParams();

    // Component state - camera properties
    const { hasPermission, requestPermission } = useCameraPermission();
    const isFocused = useIsFocused();
    const [ cameraFacing, setCameraFacing ] = useState<CameraPosition>("front");
    const device = useCameraDevice(cameraFacing);
    const camera = useRef<VisionCamera>(null);
    const { width, height } = useWindowDimensions();

    // Component state - face detection options
    const faceDetectionOptions = useRef<FaceDetectionOptions>( {
        performanceMode: 'fast',
        classificationMode: 'all',
        contourMode: 'all',
        landmarkMode: 'all',
        windowWidth: width,
        windowHeight: height
    } ).current;

    // Component state - other face detection properties
    const [faceRect, setFaceRect] = useState< Bounds | null >(null);

    // Component state - connected pokemon
    const pokemon = usePokemon(name as string);

    // Navigation state
    const navigation = useNavigation();

    // Step 1 - request permissions and initialize component state
    // -----------------------------------------------------------

    useEffect(() => {
        if (!hasPermission)
            requestPermission();

        return () => setFaceRect(null);
    }, []);

    // Step 2 - frame processing implementation
    // ----------------------------------------

    // Face detection handler
    const handleFaceDetection = (faces: Face[], frame: Frame): void => {
        // No faces detected
        if (faces.length == 0) {
            setFaceRect({x: 0, y: 0, width: 0, height: 0});
            return;
        }

        // Some faces detected
        // - Save the properties of the first detected face
        setFaceRect(faces[0].bounds);

        // Additional camera actions if needed
        if (camera.current) {
            // ...
        }
    };

    // Step 3 - render component
    // -------------------------

    // Additional layout issues
    useLayoutEffect(() => navigation.setOptions({title: "Camera"}), []);

    // Failure screen 1 - no camera permissions granted
    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorLabel}>No permissions to use camera</Text>
            </View>
        );
    }

    // Failure screen 2 - camera device error
    if (device == null) {
        return (
            <View style={styles.container} >
                <Feather name="camera-off" size={80} color="#000000" style={{marginBottom: 20}} />
                <Text style={styles.errorLabel}>
                    Camera device unavailable
                </Text>
            </View>
        );
    }

    // Main screen - camera view
    return (
        <View style={styles.container}>
            {hasPermission && device != null && (<Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isFocused}
                faceDetectionCallback={handleFaceDetection}
                faceDetectionOptions={{
                    ...faceDetectionOptions,
                    autoMode: true,
                    cameraFacing: cameraFacing
                }}
            />)}
            {faceRect && pokemon && <Image
                source={{ uri: pokemon!.sprites.front_default }}
                style={{
                    position: 'absolute',
                    left: faceRect.x,
                    top: faceRect.y,
                    width: faceRect.width,
                    height: faceRect.height
                }}
                resizeMode="stretch"
            />}
            <View style={styles.cameraNavContainer}>
                <View style={styles.cameraNavRow}>
                    <Button
                        onPress={ () => setCameraFacing( ( current ) => (current === 'front' ? 'back' : 'front') ) }
                        title={ 'Toggle Cam' }
                    />
                </View>
            </View>
        </View>
    );
}


// ----------------------------
// Pokemon camera view - styles
// ----------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    errorLabel: {
        fontSize: 24,
        fontWeight: '600'
    },
    cameraNavContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    cameraNavRow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});