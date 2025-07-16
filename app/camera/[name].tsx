import usePokemon from "@/hooks/usePokemon";
import { Feather } from "@expo/vector-icons";
import { Skia, useImage } from "@shopify/react-native-skia";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CameraPosition, DrawableFrame, Frame, useCameraDevice, useCameraPermission, Camera as VisionCamera } from "react-native-vision-camera";
import { Camera, Face, FaceDetectionOptions } from "react-native-vision-camera-face-detector";


// -------------------
// Pokemon camera view
// -------------------

export default function PokeCam() {
    // Root parameters
    // - Obtain pokemon ID from root parameters of the URL screen path
    const { name } = useLocalSearchParams();

    // Component state - camera properties
    const { hasPermission, requestPermission } = useCameraPermission();
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
    const aFaceW = useSharedValue( 0 )
    const aFaceH = useSharedValue( 0 )
    const aFaceX = useSharedValue( 0 )
    const aFaceY = useSharedValue( 0 )
    const aRot = useSharedValue( 0 )
    const boundingBoxStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        borderWidth: 4,
        borderLeftColor: 'rgb(0,255,0)',
        borderRightColor: 'rgb(0,255,0)',
        borderBottomColor: 'rgb(0,255,0)',
        borderTopColor: 'rgb(255,0,0)',
        width: withTiming(aFaceW.value, { duration: 100 }),
        height: withTiming(aFaceH.value, { duration: 100 }),
        left: withTiming(aFaceX.value, { duration: 100 }),
        top: withTiming(aFaceY.value, { duration: 100 }),
        transform: [{ rotate: `${aRot.value}deg` }],
    }));

    // Component state - connected pokemon
    const pokemon = usePokemon(name as string);
    const image = useImage(pokemon?.sprites.front_default);
    const imagePaint = Skia.Paint();

    // Navigation state
    const navigation = useNavigation();

    // Step 1 - request permissions and initialize component state
    // -----------------------------------------------------------

    useEffect(() => {
        if (!hasPermission)
            requestPermission();
    }, []);

    // Step 2 - frame processing implementation
    // ----------------------------------------

    // Camera rotation handler
    const handleCameraRotation = (rotation: number): void => { aRot.set(rotation); };

    // Face detection handler
    const handleFaceDetection = (faces: Face[], frame: Frame): void => {
        // No faces detected
        if (faces.length == 0) {
            aFaceW.value = aFaceH.value = aFaceX.value = aFaceY.value = 0;
            return;
        }

        // Some faces detected
        // - Save the properties of the first detected face
        aFaceW.value = faces[0].bounds.width;
        aFaceH.value = faces[0].bounds.height;
        aFaceX.value = faces[0].bounds.x;
        aFaceY.value = faces[0].bounds.y;

        // Additional camera actions if needed
        if (camera.current) {
            // ...
        }
    };

    // Frame drawing handler (with Skia)
    const handleSkiaAction = (faces: Face[], frame: DrawableFrame): void => {
        'worklet'

        if (faces.length === 0 || !image) return;
        const { x, y, width, height } = faces[0].bounds;
        const src = Skia.XYWHRect(0, 0, image.width(), image.height());
        const dst = Skia.XYWHRect(x, y, width, height);
        frame.drawImageRect(image, src, dst, imagePaint);
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
        <>
            <View style={styles.container}>
                <Camera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    onUIRotationChanged={handleCameraRotation}
                    faceDetectionCallback={handleFaceDetection}
                    skiaActions={handleSkiaAction}
                    faceDetectionOptions={{
                        ...faceDetectionOptions,
                        autoMode: false,
                        cameraFacing: cameraFacing
                    }}
                />
                <Animated.View
                    style={ boundingBoxStyle }
                />
            </View>
            <View style={styles.cameraNavContainer}>
                <View style={styles.cameraNavRow}>
                    <Button
                        onPress={ () => setCameraFacing( ( current ) => (current === 'front' ? 'back' : 'front') ) }
                        title={ 'Toggle Cam' }
                    />
                </View>
            </View>
        </>
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