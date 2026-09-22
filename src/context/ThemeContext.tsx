import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  allowThemeToggle: boolean;
  setAllowThemeToggle: (allowed: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allowThemeToggle, setAllowThemeToggle] = useState<boolean>(true);
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("cipher_theme") as Theme;
    if (saved === "dark" || saved === "light") return saved;
    return "dark"; // Default to cipher dark mode
  });

  // Fetch allow_theme_toggle setting from public content API
  useEffect(() => {
    fetch("/api/public/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.map) {
          const val = data.map.allow_theme_toggle;
          const allowed = val !== "false";
          setAllowThemeToggle(allowed);
          if (!allowed) {
            setThemeState("dark");
            localStorage.setItem("cipher_theme", "dark");
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    // If theme switching is disallowed by admin, strictly enforce dark mode
    const effectiveTheme = allowThemeToggle ? theme : "dark";

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      body.classList.remove("dark");
      body.classList.add("light");
    }
    localStorage.setItem("cipher_theme", effectiveTheme);
  }, [theme, allowThemeToggle]);

  const toggleTheme = () => {
    if (!allowThemeToggle) return;
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: Theme) => {
    if (!allowThemeToggle && newTheme !== "dark") return;
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: allowThemeToggle ? theme : "dark",
        toggleTheme,
        setTheme,
        allowThemeToggle,
        setAllowThemeToggle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
