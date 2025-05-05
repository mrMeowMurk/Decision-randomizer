import React from 'react';

/**
 * Компонент переключения темы оформления (светлая/темная)
 * 
 * @component
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isDarkMode - Текущее состояние темной темы
 * @param {Function} props.onToggle - Обработчик переключения темы
 * @example
 * return (
 *   <ThemeToggle 
 *     isDarkMode={false}
 *     onToggle={() => setIsDarkMode(!isDarkMode)}
 *   />
 * )
 */
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