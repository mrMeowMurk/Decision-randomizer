import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState('');
  const [newOption, setNewOption] = useState('');
  const [history, setHistory] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  const categories = {
    'travel': 'Куда поехать',
    'food': 'Что поесть',
    'entertainment': 'Что посмотреть',
    'games': 'Во что поиграть',
    'activities': 'Чем заняться',
    'shopping': 'Что купить'
  };

  const defaultOptions = {
    'travel': ['Париж', 'Рим', 'Токио', 'Нью-Йорк', 'Барселона', 'Лондон', 'Дубай', 'Сингапур'],
    'food': ['Пицца', 'Суши', 'Бургер', 'Паста', 'Салат', 'Стейк', 'Рамен', 'Тако'],
    'entertainment': ['Фильм', 'Сериал', 'YouTube', 'Книга', 'Подкаст', 'Концерт', 'Театр', 'Выставка'],
    'games': ['Minecraft', 'The Witcher 3', 'Cyberpunk 2077', 'Red Dead Redemption 2', 'Elden Ring', 'God of War', 'Horizon'],
    'activities': ['Прогулка', 'Спорт', 'Чтение', 'Готовка', 'Медитация', 'Йога', 'Рисование', 'Музыка'],
    'shopping': ['Одежда', 'Электроника', 'Книги', 'Спорттовары', 'Косметика', 'Аксессуары', 'Мебель']
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('randomizer-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setOptions(defaultOptions[category]);
    setResult('');
  };

  const addOption = () => {
    if (newOption.trim() && selectedCategory) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addOption();
    }
  };

  const removeOption = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const getRandomOption = () => {
    if (options.length > 0) {
      setIsSpinning(true);
      
      // Эффект "вращения" перед выбором
      let spins = 0;
      const maxSpins = 20;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * options.length);
        setResult(options[randomIndex]);
        spins++;
        
        if (spins >= maxSpins) {
          clearInterval(interval);
          const finalResult = options[Math.floor(Math.random() * options.length)];
          setResult(finalResult);
          setIsSpinning(false);
          
          // Сохраняем в историю
          const newHistory = [...history, {
            category: categories[selectedCategory],
            result: finalResult,
            timestamp: new Date().toLocaleString()
          }].slice(-10);
          setHistory(newHistory);
          localStorage.setItem('randomizer-history', JSON.stringify(newHistory));
        }
      }, 100);
    }
  };

  return (
    <div className="App">
      <h1>Рандомайзер решений</h1>
      
      <div className="categories">
        {Object.entries(categories).map(([key, value]) => (
          <button
            key={key}
            className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => handleCategoryChange(key)}
          >
            {value}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="options-section">
          <h2>{categories[selectedCategory]}</h2>
          
          <div className="add-option">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Добавить новый вариант"
            />
            <button onClick={addOption}>Добавить</button>
          </div>

          <div className="options-list">
            {options.map((option, index) => (
              <div key={index} className="option-item">
                {option}
                <button 
                  className="remove-option" 
                  onClick={() => removeOption(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button 
            className={`random-btn ${isSpinning ? 'spinning' : ''}`} 
            onClick={getRandomOption}
            disabled={isSpinning}
          >
            {isSpinning ? 'Выбираем...' : 'Выбрать случайный вариант'}
          </button>

          {result && (
            <div className={`result ${isSpinning ? 'spinning' : ''}`}>
              <h3>Результат:</h3>
              <div className="result-text">{result}</div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history-section">
              <h3>История выборов</h3>
              <div className="history-list">
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <span className="history-category">{item.category}:</span>
                    <span className="history-result">{item.result}</span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
