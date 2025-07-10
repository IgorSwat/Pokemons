import { LatLng } from "react-native-maps";

// Common constants
const R = 6371e3; // An approximation for earth radius [metres]


// -------------------------------------
// Data types - map elements - map state
// -------------------------------------

// Represents a complete state of a map
export interface State {
    center: Coords;
    scale: Scale;
};


// ---------------------------------------
// Data types - map elements - coordinates
// ---------------------------------------

// Defines the position on a map
// - Latitude defines the SOUTH-NORTH coordinate, and longtitude defines the WEST-EAST coordinate
export type Coords = LatLng;

// Converts latitude difference to meters
export function latToMetres(latDelta: number) : number {
    return latDelta * (Math.PI / 180) * R;
}

// Converts longtitude difference to meters
// - Requires additional information about latitude absolute position
export function longToMeters(longDelta: number, lat: number) : number {
    return longDelta * (Math.PI / 180) * R * Math.cos(lat * Math.PI / 180);
}

// Calculates distance between two map points in metres
export function distance(x1: Coords, x2: Coords): number {
    const φ1 = x1.latitude * Math.PI/180; // φ, λ in radians
    const φ2 = x2.latitude * Math.PI/180;
    const Δφ = (x2.latitude - x1.latitude) * Math.PI/180;
    const Δλ = (x2.longitude - x2.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}


// ---------------------------------
// Data types - map elements - scale
// ---------------------------------

// Defines map scale in both directions
// - The same units as for Coords type
export interface Scale {
    latitudeDelta: number;
    longitudeDelta: number;
};


// -------------------------------------
// Data types - map elements - map items
// -------------------------------------

// Represents a (named) marker on the map
export interface Item {
    name: string;       // Any valid identifier
    coords: Coords;
};

export type Pokemon = Item;