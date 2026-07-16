// PowerTranz hosted-page client.
//
// PowerTranz is First Atlantic Commerce (FAC)'s next-generation gateway. Used
// by the major Caribbean banks (NCB, Scotia, RBC) to accept card payments.
// Docs: https://developer.powertranz.com/
//
// Flow (Hosted Page / "SPI Auth" with redirect):
//   1. POST /spi/auth with headers PowerTranz-PowerTranzId +
//      PowerTranz-PowerTranzPassword. Body includes the amount, order id, and
//      an ExtendedData.MerchantResponseURL that PowerTranz will POST back to.
//   2. PowerTranz returns a RedirectData / IsoResponseCode + a URL / HTML we
//      hand off to the mobile app. The user completes 3DS + card entry on
//      PowerTranz's hosted page.
//   3. When done, PowerTranz POSTs the transaction result to our
//      MerchantResponseURL. That handler lives in
//      routes/payments-powertranz-webhook.ts.
//
// CurrencyCode is the ISO 4217 numeric code as a 3-char string: "840" = USD.

import { logger } from './logger';

const PWT_ID = process.env.POWERTRANZ_PWT_ID || '';
const PWT_PASSWORD = process.env.POWERTRANZ_PWT_PASSWORD || '';
const ENVIRONMENT = (process.env.POWERTRANZ_ENVIRONMENT || 'staging') as
  | 'staging'
  | 'production';

export function powertranzConfigured(): boolean {
  return Boolean(PWT_ID && PWT_PASSWORD);
}

function baseUrl(): string {
  return ENVIRONMENT === 'production'
    ? 'https://gateway.ptranz.com/api'
    : 'https://staging.ptranz.com/api';
}

export interface PowertranzRequestParams {
  orderId: string;
  totalUsd: number;
  customerName: string;
  customerEmail: string;
  responseUrl: string;
  productName: string;
}

export interface PowertranzRequestResult {
  redirectUrl: string;
  transactionIdentifier: string;
  spiToken?: string;
}

/**
 * Create a PowerTranz hosted-page auth request. Returns the URL the user's
 * browser should be pointed at, plus the TransactionIdentifier we use to
 * correlate the async webhook callback with our booking/order.
 */
export async function createPowertranzCheckout(
  params: PowertranzRequestParams
): Promise<PowertranzRequestResult> {
  if (!powertranzConfigured()) {
    throw new Error('PowerTranz is not configured on this server');
  }

  // PowerTranz TransactionIdentifier must be a GUID/UUID-ish string, 36 chars max.
  // We use the orderId for correlation but pass it through OrderIdentifier;
  // TransactionIdentifier gets its own randomised value so retries don't collide.
  const transactionIdentifier = cryptoRandomUuid();

  const body = {
    TransactionIdentifier: transactionIdentifier,
    TotalAmount: params.totalUsd.toFixed(2),
    CurrencyCode: '840', // USD, ISO 4217 numeric
    ThreeDSecure: true,
    Source: {
      // Empty Source triggers the hosted-page flow — user enters card on
      // PowerTranz's page rather than us posting card data.
    },
    OrderIdentifier: params.orderId,
    BillingAddress: {
      FirstName: params.customerName.split(' ')[0] || params.customerName,
      LastName: params.customerName.split(' ').slice(1).join(' ') || '.',
      EmailAddress: params.customerEmail,
    },
    AddressMatch: false,
    ExtendedData: {
      ThreeDSecure: {
        ChallengeWindowSize: 4,
        ChallengeIndicator: '01',
      },
      MerchantResponseURL: params.responseUrl,
    },
  };

  const url = `${baseUrl()}/spi/auth`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'PowerTranz-PowerTranzId': PWT_ID,
      'PowerTranz-PowerTranzPassword': PWT_PASSWORD,
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    logger.error({ status: res.status, raw }, '[powertranz] non-JSON response');
    throw new Error(`PowerTranz returned a non-JSON response (status ${res.status})`);
  }

  if (!res.ok) {
    logger.error({ status: res.status, parsed }, '[powertranz] request failed');
    throw new Error(
      parsed?.Errors?.[0]?.Message || `PowerTranz request failed (status ${res.status})`
    );
  }

  // PowerTranz returns RedirectData (HTML) OR SpiToken + a redirect URL,
  // depending on the ThreeDSecure setting.
  // For hosted-page flow with ThreeDSecure=true, we get a RedirectData URL.
  const redirectUrl: string | undefined =
    parsed.RedirectData ||
    parsed.RedirectUrl ||
    (parsed.SpiToken
      ? `${ENVIRONMENT === 'production' ? 'https://gateway.ptranz.com' : 'https://staging.ptranz.com'}/api/spi/${parsed.SpiToken}`
      : undefined);

  if (!redirectUrl) {
    logger.error({ parsed }, '[powertranz] no redirect URL in response');
    throw new Error('PowerTranz did not return a redirect URL');
  }

  return {
    redirectUrl,
    transactionIdentifier,
    spiToken: parsed.SpiToken,
  };
}

/**
 * Verify a transaction by re-querying PowerTranz. Called from the webhook so
 * we never trust the request body alone.
 */
export async function verifyPowertranzTransaction(
  transactionIdentifier: string
): Promise<{
  approved: boolean;
  amount?: number;
  orderId?: string;
  isoResponseCode?: string;
} | null> {
  if (!powertranzConfigured()) return null;

  const url = `${baseUrl()}/spi/payment/${transactionIdentifier}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'PowerTranz-PowerTranzId': PWT_ID,
        'PowerTranz-PowerTranzPassword': PWT_PASSWORD,
      },
    });
    if (!res.ok) return null;
    const parsed: any = await res.json();
    return {
      // ISO 8583 code "00" = approved. PowerTranz mirrors that.
      approved: parsed.IsoResponseCode === '00' && parsed.Approved === true,
      amount: parsed.TotalAmount ? Number(parsed.TotalAmount) : undefined,
      orderId: parsed.OrderIdentifier,
      isoResponseCode: parsed.IsoResponseCode,
    };
  } catch (err) {
    logger.error({ err }, '[powertranz] verify failed');
    return null;
  }
}

// UUID v4 without pulling in a dep — Node has crypto.randomUUID since 14.17.
function cryptoRandomUuid(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { randomUUID } = require('crypto');
  return randomUUID();
}
