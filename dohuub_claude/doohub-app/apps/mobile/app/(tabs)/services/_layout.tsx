import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="cleaning" />
      <Stack.Screen name="handyman" />
      <Stack.Screen name="beauty" />
      <Stack.Screen name="groceries" />
      <Stack.Screen name="rentals" />
      <Stack.Screen name="caregiving" />
    </Stack>
  );
}

