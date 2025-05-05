import React from 'react';

/**
 * Компонент управления звуковыми эффектами
 * 
 * @component
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isSoundEnabled - Состояние звука (включен/выключен)
 * @param {Function} props.onToggle - Обработчик переключения звука
 */
const SoundToggle = ({ isSoundEnabled, onToggle }) => {
  return (
    <div className="sound-toggle">
      <button 
        onClick={onToggle}
        className="sound-toggle-btn"
        title={`${isSoundEnabled ? "Выключить" : "Включить"} звук`}
      >
        {isSoundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

export default SoundToggle; 