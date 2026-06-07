import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { api } from './api';

type UploadResponse = {
  success: boolean;
  data?: { url: string; id: string; filename: string };
  error?: string;
};

/**
 * Open the image library, let the user pick + crop a square photo,
 * upload it to the API (→ Supabase Storage), and return the public URL.
 * Returns null if the user cancels or any step fails.
 */
export async function pickAndUploadAvatar(): Promise<string | null> {
  // Ask for permission first so we can show a clear message on denial.
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert(
      'Photo access needed',
      'Enable photo library access in Settings to pick a profile picture.'
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];
  const filename = asset.fileName || `avatar-${Date.now()}.jpg`;
  const mimeType = asset.mimeType || 'image/jpeg';

  const formData = new FormData();
  // React Native FormData accepts this {uri, name, type} shape — TS doesn't
  // know about it because it expects a Blob, so cast to any.
  formData.append('image', {
    uri: asset.uri,
    name: filename,
    type: mimeType,
  } as any);

  try {
    const response = await api.post<UploadResponse>(
      '/api/v1/upload/image?type=avatar',
      formData,
      {
        // Let axios set multipart Content-Type WITH boundary by clearing the
        // default 'application/json' header on this request only.
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: (data) => data,
      }
    );
    if (!response.success || !response.data?.url) {
      Alert.alert('Upload failed', response.error || 'Try again.');
      return null;
    }
    return response.data.url;
  } catch (err: any) {
    Alert.alert('Upload failed', err?.message || 'Try again.');
    return null;
  }
}
