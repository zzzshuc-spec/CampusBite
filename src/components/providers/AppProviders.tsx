"use client";

import { PreferencesProvider } from "@/store/preferences-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <PreferencesProvider>{children}</PreferencesProvider>;
}

