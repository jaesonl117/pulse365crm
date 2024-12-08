import { useState, useEffect } from 'react';

const SCRIPT_ID = 'google-maps-script';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GoogleMapsState {
  isLoaded: boolean;
  hasError: boolean;
}

class GoogleMapsService {
  private static instance: GoogleMapsService;
  private loadPromise: Promise<void> | null = null;
  private subscribers = new Set<(state: GoogleMapsState) => void>();

  private constructor() {}

  static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  private notify(state: GoogleMapsState) {
    this.subscribers.forEach(subscriber => subscriber(state));
  }

  subscribe(callback: (state: GoogleMapsState) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  loadScript(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    if (window.google?.maps) {
      this.loadPromise = Promise.resolve();
      this.notify({ isLoaded: true, hasError: false });
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.getElementById(SCRIPT_ID)) {
        reject(new Error('Google Maps script is already loading'));
        return;
      }

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.notify({ isLoaded: true, hasError: false });
        resolve();
      };

      script.onerror = () => {
        this.loadPromise = null;
        this.notify({ isLoaded: false, hasError: true });
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}

export const googleMapsService = GoogleMapsService.getInstance();

export function useGoogleMaps() {
  const [state, setState] = useState<GoogleMapsState>({
    isLoaded: !!window.google?.maps,
    hasError: false,
  });

  useEffect(() => {
    const unsubscribe = googleMapsService.subscribe(setState);
    
    if (!state.isLoaded && !state.hasError) {
      googleMapsService.loadScript().catch(() => {
        // Error is handled through subscription
      });
    }

    return unsubscribe;
  }, []);

  return state;
}