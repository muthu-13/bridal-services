import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkTheme(true);
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  }, []);

  const applyDarkTheme = () => {
    document.body.style.backgroundColor = "#1a1a1a";
    document.body.style.color = "#ffffff";
    document.documentElement.style.backgroundColor = "#1a1a1a";
    document.documentElement.style.color = "#ffffff";
  };

  const applyLightTheme = () => {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#333333";
    document.documentElement.style.backgroundColor = "#ffffff";
    document.documentElement.style.color = "#333333";
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) applyDarkTheme();
    else applyLightTheme();
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
