import { Feather } from "@expo/vector-icons";
import { ClipOp, Skia, TileMode } from "@shopify/react-native-skia";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DrawableFrame, Frame, useCameraDevice, useCameraPermission, Camera as VisionCamera } from "react-native-vision-camera";
import { Camera, Contours, Face, FaceDetectionOptions } from "react-native-vision-camera-face-detector";


// -------------------
// Pokemon camera view
// -------------------

export default function PokeCam() {
    // Root parameters
    // - Obtain pokemon ID from root parameters of the URL screen path
    const { name } = useLocalSearchParams();

    // Component state - camera properties
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice("back");
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

        // If we do not detect any face, there is nothing to do
        if (faces.length == 0) return;

        // Extract the first detected face
        const { bounds, contours, landmarks } = faces[ 0 ];

        // Temporary code from github example of face-detection plugin
        // draw a blur shape around the face points
        const blurRadius = 25
        const blurFilter = Skia.ImageFilter.MakeBlur(
            blurRadius,
            blurRadius,
            TileMode.Repeat,
            null
        )
        const blurPaint = Skia.Paint()
        blurPaint.setImageFilter( blurFilter )
        const contourPath = Skia.Path.Make()
        const necessaryContours: ( keyof Contours )[] = [
            'FACE',
            'LEFT_CHEEK',
            'RIGHT_CHEEK'
        ]

        necessaryContours.map( ( key ) => {
            contours?.[ key ]?.map( ( point, index ) => {
                if ( index === 0 ) {
                // it's a starting point
                contourPath.moveTo( point.x, point.y )
                } else {
                // it's a continuation
                contourPath.lineTo( point.x, point.y )
                }
            } )
            contourPath.close()
        } );

        frame.save()
        frame.clipPath( contourPath, ClipOp.Intersect, true )
        frame.render( blurPaint )
        frame.restore()
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
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                onUIRotationChanged={handleCameraRotation}
                faceDetectionCallback={handleFaceDetection}    // tmp
                skiaActions={handleSkiaAction}              // tmp
                faceDetectionOptions={{
                    ...faceDetectionOptions
                }}
            />
            <Animated.View
                style={ boundingBoxStyle }
            />
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
    }
});