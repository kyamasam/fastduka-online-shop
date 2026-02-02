import { SiteSettings } from '@/types/settings';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Fetch site settings on the server side
 * This ensures settings are available in the initial HTML for SEO
 * Cache is revalidated every 30 minutes (1800 seconds)
 */
export async function getSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
       cache: 'no-store',
      // next: { revalidate: 1800 }, // Cache for 30 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch settings:', res.statusText);
      return null;
    }

    const data: SiteSettings = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

/**
 * Get default/fallback settings when API fails
 */
export function getDefaultSettings(): Partial<SiteSettings> {
  return {
    title: 'FastDuka',
    currency_code: 'KES',
    currency_symbol: 'Ksh',
    primary_color: '#2E8B57',
    secondary_color: '#ffffff',
    logo_text: 'FastDuka',
    contact_email: 'info@fastduka.com',
    contact_phone: '+254700000000',
    location: 'Nairobi, Kenya',
  };
}
