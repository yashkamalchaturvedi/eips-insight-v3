import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    // If there's a saved theme, use it, otherwise default to system
    return savedTheme || "system";
  });

  // Determine the actual theme to apply based on the selected theme and system preference
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  });

  // Update the theme in localStorage and document whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // If theme is system, we need to check the system preference
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
      
      // Listen for changes to system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  // Apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the current theme class
    root.classList.remove("light", "dark");
    
    // Add the new theme class
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => setTheme(newTheme),
    toggleTheme: () => {
      setTheme(prevTheme => {
        if (prevTheme === "dark") return "light";
        if (prevTheme === "light") return "dark";
        // If system, toggle to the opposite of the current system theme
        return resolvedTheme === "dark" ? "light" : "dark";
      });
    }
  };
}
