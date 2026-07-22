import React from 'react';
import { LegalWebView } from '../src/components/LegalWebView';
import { PRIVACY_URL } from '../src/constants/legal';

export default function PrivacyScreen() {
  return (
    <LegalWebView
      title="Privacy Policy"
      url={PRIVACY_URL}
      fallbackRoute="/(auth)/welcome"
    />
  );
}
