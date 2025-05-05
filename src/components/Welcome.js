import React from 'react';

/**
 * Компонент приветствия, отображающий заголовок и основные особенности приложения
 * 
 * @component
 * @example
 * return (
 *   <Welcome />
 * )
 */
const Welcome = () => {
  return (
    <div className="welcome-section">
      {/* Секция с заголовком и эмодзи */}
      <div className="welcome-title">
        <span className="welcome-emoji" aria-label="dice emoji">🎲</span>
        <h1>Рандомайзер решений</h1>
      </div>
      
      {/* Описание и ключевые особенности */}
      <div className="welcome-description">
        <p className="tagline">Сложный выбор? Доверьтесь случаю</p>
        <div className="features">
          <span className="feature-item" title="Интеллектуальный алгоритм выбора">✨ Умный выбор</span>
          <span className="feature-divider" aria-hidden="true">•</span>
          <span className="feature-item" title="Точные результаты">🎯 Точность</span>
          <span className="feature-divider" aria-hidden="true">•</span>
          <span className="feature-item" title="Быстрое принятие решений">🚀 Скорость</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 