'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { sendAnalyticsEvent } from '../lib/api';

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children }) {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('simpleads_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('simpleads_device_id', id);
    }
    setDeviceId(id);

    // Track initial page view
    sendAnalyticsEvent('page_view', id, { path: window.location.pathname }).catch(console.error);
  }, []);

  const trackEvent = (eventName, payload = {}) => {
    if (!deviceId) return;
    sendAnalyticsEvent(eventName, deviceId, payload).catch(console.error);
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, deviceId }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export const useAnalytics = () => useContext(AnalyticsContext);
