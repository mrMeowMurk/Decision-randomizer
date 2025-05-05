import { useState, useEffect, useCallback } from 'react';

/**
 * Хук для управления звуковыми эффектами
 * 
 * @param {Object} options - Настройки звука
 * @param {boolean} options.enabled - Включен ли звук по умолчанию
 * @returns {Object} Объект с методами управления звуком
 */
const useSound = ({ enabled = true } = {}) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('sound-enabled');
    return saved !== null ? JSON.parse(saved) : enabled;
  });

  // Создаем звуки
  const createSounds = useCallback(() => ({
    drum: new Audio('/sounds/drum.mp3'),
    fanfare: new Audio('/sounds/fanfare.mp3')
  }), []);

  const [sounds, setSounds] = useState(createSounds);

  // Сохранение настроек звука
  useEffect(() => {
    localStorage.setItem('sound-enabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const playSound = useCallback((soundName) => {
    if (!isSoundEnabled) return;
    
    const sound = sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.log('Ошибка воспроизведения:', error);
        // Пробуем пересоздать звук при ошибке
        const newSounds = createSounds();
        newSounds[soundName].play().catch(e => console.log('Повторная ошибка:', e));
        setSounds(newSounds);
      });
    }
  }, [isSoundEnabled, sounds, createSounds]);

  return {
    isSoundEnabled,
    setIsSoundEnabled,
    playSound
  };
};

export default useSound; 