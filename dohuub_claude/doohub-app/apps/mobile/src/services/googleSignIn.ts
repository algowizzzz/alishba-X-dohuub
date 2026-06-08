import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

// Some platforms keep the auth session "warm"; this ensures we always start
// a fresh OAuth flow. Safe to call multiple times.
WebBrowser.maybeCompleteAuthSession();

type Outcome = 'success' | 'cancelled' | 'error';

/**
 * Run the Google OAuth flow via Supabase's browser-based provider, then
 * promote the returned tokens into a Supabase session. The app's
 * onAuthStateChange listener (mounted in app/_layout.tsx) picks the session
 * up and fans it out to authStore — no extra plumbing needed here.
 *
 * Requires the Google provider to be enabled in Supabase Auth → Providers,
 * and the redirect URL below to be allow-listed in Supabase Auth → URL
 * Configuration → Redirect URLs.
 */
export async function signInWithGoogle(): Promise<Outcome> {
  // doohub://auth/callback (matches the scheme in app.json).
  const redirectTo = Linking.createURL('auth/callback');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error || !data?.url) {
    Alert.alert('Google sign-in failed', error?.message || 'Try again.');
    return 'error';
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return 'cancelled';
  }
  if (result.type !== 'success' || !result.url) {
    return 'error';
  }

  // Supabase returns tokens in the URL fragment (#access_token=...) for the
  // implicit flow. Parse both fragment and query because the fragment carrier
  // varies between platforms.
  const url = result.url;
  const fragment = url.split('#')[1] || '';
  const query = url.split('?')[1]?.split('#')[0] || '';
  const params = new URLSearchParams(`${fragment}&${query}`);

  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');

  if (!access_token || !refresh_token) {
    // PKCE flow path: Supabase returns ?code=... and we have to exchange it.
    const code = params.get('code');
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        Alert.alert('Google sign-in failed', exchangeError.message);
        return 'error';
      }
      return 'success';
    }
    Alert.alert('Google sign-in failed', 'No tokens returned from provider.');
    return 'error';
  }

  const { error: setError } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (setError) {
    Alert.alert('Google sign-in failed', setError.message);
    return 'error';
  }
  return 'success';
}
