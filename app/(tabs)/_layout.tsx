// app/(tabs)/_layout.tsx
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


// -----------
// Tabs layout
// -----------

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokemons",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="catching-pokemon" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorite",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="map-marker" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}