import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type LocationContextValue = {
  location: string;
  setLocation: (val: string) => void;
};

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

const STORAGE_KEY = "@comein_location_v1";
const DEFAULT_LOCATION = "Set delivery location";

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<string>(DEFAULT_LOCATION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setLocationState(raw);
      } catch {}
      setHydrated(true);
    })();
  }, []);

  const setLocation = useCallback((val: string) => {
    const trimmed = val.trim();
    const next = trimmed.length ? trimmed : DEFAULT_LOCATION;
    setLocationState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  useEffect(() => {
    if (!hydrated) return;
  }, [hydrated]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationCtx() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationCtx must be used within LocationProvider");
  return ctx;
}
