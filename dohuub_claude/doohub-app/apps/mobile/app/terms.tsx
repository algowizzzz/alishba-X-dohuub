import React from 'react';
import { LegalWebView } from '../src/components/LegalWebView';
import { TERMS_URL } from '../src/constants/legal';

export default function TermsScreen() {
  return (
    <LegalWebView
      title="Terms of Service"
      url={TERMS_URL}
      fallbackRoute="/(auth)/welcome"
    />
  );
}
