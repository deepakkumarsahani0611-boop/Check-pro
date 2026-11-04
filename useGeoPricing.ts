import { useEffect, useState } from 'react';

export type Currency = 'USD' | 'INR';

interface GeoPricingState {
  currency: Currency;
  detected: boolean;
}

const CACHE_KEY = 'jobcheck-geo-country';
const GEO_ENDPOINT = 'https://ipapi.co/json/';

function currencyForCountry(countryCode: string): Currency {
  return countryCode === 'IN' ? 'INR' : 'USD';
}

export function useGeoPricing(): GeoPricingState {
  const [state, setState] = useState<GeoPricingState>(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached
      ? { currency: currencyForCountry(cached), detected: true }
      : { currency: 'USD', detected: false };
  });

  useEffect(() => {
    if (sessionStorage.getItem(CACHE_KEY)) return;

    const controller = new AbortController();

    fetch(GEO_ENDPOINT, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        const countryCode = (data as { country_code?: unknown } | null)?.country_code;
        if (typeof countryCode !== 'string' || countryCode.length !== 2) return;
        sessionStorage.setItem(CACHE_KEY, countryCode);
        setState({ currency: currencyForCountry(countryCode), detected: true });
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return state;
}
