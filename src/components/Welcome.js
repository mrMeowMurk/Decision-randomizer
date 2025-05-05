import React from 'react';

const Welcome = () => {
  return (
    <div className="welcome-section">
      <div className="welcome-title">
        <span className="welcome-emoji">🎲</span>
        <h1>Рандомайзер решений</h1>
      </div>
      <div className="welcome-description">
        <p className="tagline">Сложный выбор? Доверьтесь случаю</p>
        <div className="features">
          <span className="feature-item">✨ Умный выбор</span>
          <span className="feature-divider">•</span>
          <span className="feature-item">🎯 Точность</span>
          <span className="feature-divider">•</span>
          <span className="feature-item">🚀 Скорость</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 