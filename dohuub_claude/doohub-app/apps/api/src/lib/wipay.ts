// WiPay hosted-checkout client.
//
// WiPay is the SME payment gateway used across the Caribbean (JM, TT, BB, GY,
// LC, AG, ...). Docs: https://wipayfinancial.com/developers
//
// Flow:
//   1. We POST /plugins/payments/request with account_number + api_key + order
//      details and a response_url that WiPay will redirect the user back to.
//   2. WiPay returns { url } — a hosted checkout page hosted by WiPay. We hand
//      that URL to the mobile app, which opens it in a WebBrowser.
//   3. When the user finishes (or cancels), WiPay POSTs the result to our
//      response_url. That handler lives in routes/payments-wipay-webhook.ts.
//
// Important:
// - The endpoint domain is country-specific: tt.wipayfinancial.com,
//   jm.wipayfinancial.com, bb.wipayfinancial.com, etc.
// - environment can be 'sandbox' (test cards) or 'live' (real money).
// - WiPay does not sign the callback with an HMAC — verification is by
//   re-querying WiPay for the transaction status. See verifyTransaction().

import { logger } from './logger';

const COUNTRY = (process.env.WIPAY_COUNTRY_CODE || 'JM').toLowerCase();
const ACCOUNT_NUMBER = process.env.WIPAY_ACCOUNT_NUMBER || '';
const API_KEY = process.env.WIPAY_API_KEY || '';
const ENVIRONMENT = (process.env.WIPAY_ENVIRONMENT || 'sandbox') as 'sandbox' | 'live';

export function wipayConfigured(): boolean {
  return Boolean(ACCOUNT_NUMBER && API_KEY);
}

function baseUrl(): string {
  return `https://${COUNTRY}.wipayfinancial.com`;
}

export interface WipayRequestParams {
  orderId: string;
  totalUsd: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  responseUrl: string;
  productName: string;
}

export interface WipayRequestResult {
  url: string;
  hash?: string;
}

/**
 * Create a WiPay hosted-checkout request. Returns the URL the user's browser
 * should be pointed at.
 */
export async function createWipayCheckout(
  params: WipayRequestParams
): Promise<WipayRequestResult> {
  if (!wipayConfigured()) {
    throw new Error('WiPay is not configured on this server');
  }

  const body = new URLSearchParams({
    account_number: ACCOUNT_NUMBER,
    api_key: API_KEY,
    environment: ENVIRONMENT,
    order_id: params.orderId,
    total: params.totalUsd.toFixed(2),
    currency: 'USD',
    fee_structure: 'customer_pay',
    origin: 'dohuub-mobile',
    country_code: COUNTRY.toUpperCase(),
    response_url: params.responseUrl,
    name: params.customerName,
    email: params.customerEmail,
    ...(params.customerPhone ? { phone: params.customerPhone } : {}),
    // WiPay uses this as the description on the hosted page + settlement report.
    addr1: params.productName.slice(0, 90),
  });

  const url = `${baseUrl()}/plugins/payments/request`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const raw = await res.text();
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    logger.error({ status: res.status, raw }, '[wipay] non-JSON response');
    throw new Error(`WiPay returned a non-JSON response (status ${res.status})`);
  }

  if (!res.ok || parsed.status?.toLowerCase?.() === 'error' || !parsed.url) {
    logger.error({ status: res.status, parsed }, '[wipay] request failed');
    throw new Error(
      parsed.message || parsed.error || `WiPay request failed (status ${res.status})`
    );
  }

  return { url: parsed.url, hash: parsed.hash };
}

/**
 * Ask WiPay for the current status of a transaction. Used by the webhook
 * handler to verify a callback rather than trusting the query string.
 */
export async function verifyWipayTransaction(transactionId: string): Promise<{
  status: string;
  total?: number;
  currency?: string;
  orderId?: string;
} | null> {
  if (!wipayConfigured()) return null;

  const body = new URLSearchParams({
    account_number: ACCOUNT_NUMBER,
    api_key: API_KEY,
    environment: ENVIRONMENT,
    transaction_id: transactionId,
  });

  const url = `${baseUrl()}/plugins/payments/status`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) return null;
    const parsed: any = await res.json();
    return {
      status: (parsed.status || parsed.transaction_status || '').toString().toLowerCase(),
      total: parsed.total ? Number(parsed.total) : undefined,
      currency: parsed.currency,
      orderId: parsed.order_id,
    };
  } catch (err) {
    logger.error({ err }, '[wipay] verify failed');
    return null;
  }
}
