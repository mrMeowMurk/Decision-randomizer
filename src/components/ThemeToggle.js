import React from 'react';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <div className="theme-toggle">
      <button onClick={onToggle} className="theme-toggle-btn">
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default ThemeToggle; 