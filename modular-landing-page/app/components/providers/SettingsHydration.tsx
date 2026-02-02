'use client';

import { useSettingsStore } from '@/store/settings.store';
import { SiteSettings } from '@/types/settings';
import { useEffect, useRef } from 'react';

interface SettingsHydrationProps {
  settings: SiteSettings | null;
}

/**
 * SettingsHydration Component
 * Hydrates the Zustand store with server-fetched settings
 * This ensures the client store has the same data as the server-rendered HTML
 * Preserves SEO while enabling client-side state management
 */
export function SettingsHydration({ settings }: SettingsHydrationProps) {
  const hasHydrated = useRef(false);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const setStoreSettings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    // Only hydrate once on mount, and only if we have settings from the server
    if (!hasHydrated.current && settings && !setStoreSettings) {
      useSettingsStore.setState({ settings, loading: false, error: null });
      hasHydrated.current = true;
    }
  }, [settings, setStoreSettings]);

  return null; // This component doesn't render anything
}
