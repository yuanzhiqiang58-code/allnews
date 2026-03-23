'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useAutoRefresh({
  enabled = true,
  interval = 5 * 60 * 1000,
  onRefresh,
  onVisibilityRefresh = true
}: {
  enabled?: boolean;
  interval?: number;
  onRefresh: () => void;
  onVisibilityRefresh?: boolean;
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    if (!enabled) return;
    intervalRef.current = setInterval(() => {
      lastRefreshRef.current = Date.now();
      onRefresh();
    }, interval);
  }, [enabled, interval, onRefresh, clear]);

  useEffect(() => {
    if (!onVisibilityRefresh) return;
    
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (Date.now() - lastRefreshRef.current > interval / 2) {
          lastRefreshRef.current = Date.now();
          onRefresh();
        }
        start();
      } else {
        clear();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [onVisibilityRefresh, interval, onRefresh, start, clear]);

  useEffect(() => {
    start();
    return clear;
  }, [start, clear]);

  return { refresh: () => { lastRefreshRef.current = Date.now(); onRefresh(); } };
}
