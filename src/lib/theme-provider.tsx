import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";
export type ColorTheme = "sunset" | "ocean" | "nature" | "royal";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("sunset");

  useEffect(() => {
    // Mode
    const savedTheme = window.localStorage.getItem("neo_cash_theme") as ThemeMode;
    if (!savedTheme) {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    } else {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    // Color Palette
    const savedColor = window.localStorage.getItem("neo_cash_color") as ColorTheme;
    if (savedColor) {
      setColorThemeState(savedColor);
      document.documentElement.dataset.theme = savedColor;
    } else {
      document.documentElement.dataset.theme = "sunset";
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("neo_cash_theme", nextTheme);
  };

  const setColorTheme = (newTheme: ColorTheme) => {
    setColorThemeState(newTheme);
    document.documentElement.dataset.theme = newTheme;
    window.localStorage.setItem("neo_cash_color", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
