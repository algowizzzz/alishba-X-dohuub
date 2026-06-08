import * as Location from 'expo-location';

export type ParsedAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
};

// Nominatim (OpenStreetMap) — free, no API key. Rate-limited to ~1 req/sec
// per their usage policy. Fine for dev + soft launch; replace with Mapbox /
// Google Places before scaling. ToS requires a descriptive User-Agent.
//
// https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'DoHuub-Mobile/1.0 (support@dohuub.com)';

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    municipality?: string;
    state?: string;
    region?: string;
    postcode?: string;
    country?: string;
  };
};

function parseNominatim(result: NominatimResult): ParsedAddress {
  const a = result.address || {};
  const street = [a.house_number, a.road || a.pedestrian].filter(Boolean).join(' ').trim();
  const city = a.city || a.town || a.village || a.hamlet || a.municipality || '';
  return {
    street,
    city,
    state: a.state || a.region || '',
    zipCode: a.postcode || '',
    country: a.country || '',
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
    displayName: result.display_name,
  };
}

/**
 * Forward geocode + autocomplete. Returns up to `limit` matches for the query.
 * Returns [] on network errors or empty queries (callers shouldn't block on this).
 */
export async function searchAddresses(query: string, limit = 5): Promise<ParsedAddress[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data: NominatimResult[] = await res.json();
    return data.map(parseNominatim);
  } catch {
    return [];
  }
}

/**
 * Ask for location permission, get the user's current GPS coords, then
 * reverse-geocode to a readable address using expo-location's built-in
 * platform geocoder (no API key needed — uses Apple/Google native services).
 *
 * Returns null on permission denial, GPS failure, or no result. Caller is
 * expected to surface an Alert / route to permission screen on null.
 */
export async function getCurrentLocationAddress(): Promise<ParsedAddress | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = position.coords;

    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    const r = results[0];
    if (!r) return null;

    const street = [r.streetNumber, r.street].filter(Boolean).join(' ').trim();
    return {
      street,
      city: r.city || r.subregion || '',
      state: r.region || '',
      zipCode: r.postalCode || '',
      country: r.country || '',
      latitude,
      longitude,
      displayName: [street, r.city, r.region, r.postalCode].filter(Boolean).join(', '),
    };
  } catch {
    return null;
  }
}
