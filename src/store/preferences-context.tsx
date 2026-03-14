"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultUniversityId } from "@/data/universities";
import { ThemeMode } from "@/types/food";

type PreferencesState = {
  selectedUniversityId: string;
  favorites: string[];
  compareList: string[];
  recentViewed: string[];
  theme: ThemeMode;
};

type PreferencesContextValue = PreferencesState & {
  hydrated: boolean;
  setSelectedUniversityId: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
  pushRecentViewed: (id: string) => void;
  toggleTheme: () => void;
};

const storageKey = "college-food-map-prefs-v1";

const defaultState: PreferencesState = {
  selectedUniversityId: defaultUniversityId,
  favorites: [],
  compareList: [],
  recentViewed: [],
  theme: "light",
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PreferencesState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as PreferencesState;
        setState({
          ...defaultState,
          ...parsed,
        });
      }
    } catch {
      setState(defaultState);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    if (hydrated) {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const setSelectedUniversityId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedUniversityId: id }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: has
          ? prev.favorites.filter((item) => item !== id)
          : [...prev.favorites, id],
      };
    });
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.compareList.includes(id);
      if (has) {
        return {
          ...prev,
          compareList: prev.compareList.filter((item) => item !== id),
        };
      }
      if (prev.compareList.length >= 3) {
        return {
          ...prev,
          compareList: [...prev.compareList.slice(1), id],
        };
      }
      return {
        ...prev,
        compareList: [...prev.compareList, id],
      };
    });
  }, []);

  const pushRecentViewed = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      recentViewed: [id, ...prev.recentViewed.filter((item) => item !== id)].slice(0, 8),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      setSelectedUniversityId,
      toggleFavorite,
      toggleCompare,
      pushRecentViewed,
      toggleTheme,
    }),
    [
      state,
      hydrated,
      setSelectedUniversityId,
      toggleFavorite,
      toggleCompare,
      pushRecentViewed,
      toggleTheme,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error("usePreferences must be used in PreferencesProvider");
  }
  return value;
}

