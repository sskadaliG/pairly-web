import { useState } from "react";

const LIGHT = "pairly";
const DARK = "pairly-dark";

const useTheme = () => {
  // index.html already set data-theme before React loaded, so start from it
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || LIGHT,
  );

  const toggleTheme = () => {
    const next = theme === DARK ? LIGHT : DARK;
    document.documentElement.setAttribute("data-theme", next);
    // Remember the choice for next time (storage can be blocked, so ignore errors)
    try {
      localStorage.setItem("theme", next);
    } catch {
      // The theme still changes, it just won't be remembered
    }
    setTheme(next);
  };

  return { isDark: theme === DARK, toggleTheme };
};

export default useTheme;
