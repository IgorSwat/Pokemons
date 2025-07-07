import AsyncStorage from "@react-native-async-storage/async-storage";

// ------------------------
// Application data storage
// ------------------------

// A wrapper class for built-in AsyncStorage
// - Allows to store fetched data in one place and group it using custom keys
// - Saves data strictly in JSON format
export default class AppStorage {
    // Add data to storage (bindided with a key)
    static async set<T>(key: string, value: T): Promise<void> {
        const json = JSON.stringify(value);

        await AsyncStorage.setItem(key, json);
    }

    // Extract data from storage
    // - Returns null if there is no data bindided to given key
    static async get<T>(key: string): Promise<T | null> {
        const json = await AsyncStorage.getItem(key);

        return json ? JSON.parse(json) : null;
    }

    // Remove data (a single instance bindided with given key) from the storage
    static async remove(key: string): Promise<void> {
        await AsyncStorage.removeItem(key);
    }

    // Remove all data from the storage
    static async clear(): Promise<void> {
        await AsyncStorage.clear();
    }
}