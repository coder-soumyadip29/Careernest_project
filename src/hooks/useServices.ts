'use client';

import { useEffect, useState } from 'react';
import { getServices } from '@/lib/dbService';
import type { ServiceItem } from '@/lib/types';

interface UseServicesReturn {
  /** Array of service items fetched from Firestore */
  services: ServiceItem[];
  /** True while the initial fetch is in progress */
  loading: boolean;
  /** Error message if the fetch failed */
  error: string | null;
  /** Manually re-fetch services */
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch all active services from the Firestore 'Services' collection.
 *
 * - Handles loading / error / data states cleanly.
 * - Auto-seeds default services on first load if the collection is empty
 *   (handled inside `getServices`).
 * - Exposes a `refresh` callback for imperative re-fetches.
 */
export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getServices();
      if (result.success) {
        setServices(result.data);
      } else {
        console.error('[useServices] Failed to fetch:', result.error);
        setError('Unable to load services. Please try again later.');
      }
    } catch (err) {
      console.error('[useServices] Unexpected error:', err);
      setError('Unable to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, refresh: fetchServices };
}
