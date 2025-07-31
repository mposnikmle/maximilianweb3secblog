"use client";

import { useState, useEffect } from "react";

interface ThemeToggleProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
}

const ThemeToggle = ({ onThemeChange, currentTheme }: ThemeToggleProps) => {
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    onThemeChange(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="itunes-button px-3 py-2 flex items-center space-x-2 text-sm"
      title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="text-lg">
        {currentTheme === 'dark' ? '☀️' : '🌙'}
      </span>
      <span className="text-gray-700">
        {currentTheme === 'dark' ? 'Light' : 'Dark'} Mode
      </span>
    </button>
  );
};

export default ThemeToggle; 