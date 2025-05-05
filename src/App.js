import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState('');
  const [newOption, setNewOption] = useState('');
  const [history, setHistory] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [customCategories, setCustomCategories] = useState({});
  const [newCategory, setNewCategory] = useState({ name: '', key: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const defaultCategories = {
    'travel': 'Куда поехать',
    'food': 'Что поесть',
    'entertainment': 'Что посмотреть',
    'games': 'Во что поиграть',
    'activities': 'Чем заняться',
    'shopping': 'Что купить'
  };

  const categories = { ...defaultCategories, ...customCategories };

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
    const savedFavorites = localStorage.getItem('randomizer-favorites');
    const savedCategories = localStorage.getItem('randomizer-categories');
    const savedTheme = localStorage.getItem('randomizer-theme');
    
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedCategories) setCustomCategories(JSON.parse(savedCategories));
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme);
      setIsDarkMode(isDark);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('randomizer-theme', JSON.stringify(newTheme));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setOptions(defaultOptions[category] || []);
    setResult('');
    setSearchTerm('');
  };

  const addOption = () => {
    if (newOption.trim() && selectedCategory) {
      const newOptionText = newOption.trim();
      setOptions(prev => [...prev, newOptionText]);
      setNewOption('');
      
      // Сохраняем опцию в localStorage для данной категории
      const savedOptions = JSON.parse(localStorage.getItem(`randomizer-options-${selectedCategory}`) || '[]');
      localStorage.setItem(`randomizer-options-${selectedCategory}`, JSON.stringify([...savedOptions, newOptionText]));
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

  const toggleFavorite = (option) => {
    const newFavorites = favorites.includes(option)
      ? favorites.filter(fav => fav !== option)
      : [...favorites, option];
    
    setFavorites(newFavorites);
    localStorage.setItem('randomizer-favorites', JSON.stringify(newFavorites));
  };

  const addCustomCategory = () => {
    if (newCategory.name && newCategory.key) {
      const newCustomCategories = {
        ...customCategories,
        [newCategory.key]: newCategory.name
      };
      setCustomCategories(newCustomCategories);
      localStorage.setItem('randomizer-categories', JSON.stringify(newCustomCategories));
      setNewCategory({ name: '', key: '' });
      setShowAddCategory(false);
    }
  };

  const getRandomOption = () => {
    if (options.length > 0) {
      setIsSpinning(true);
      
      let filteredOptions = options;
      if (searchTerm) {
        filteredOptions = options.filter(opt => 
          opt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (filteredOptions.length === 0) {
        setIsSpinning(false);
        return;
      }

      let spins = 0;
      const maxSpins = 20;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * filteredOptions.length);
        setResult(filteredOptions[randomIndex]);
        spins++;
        
        if (spins >= maxSpins) {
          clearInterval(interval);
          const finalResult = filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
          setResult(finalResult);
          setIsSpinning(false);
          
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

  const filteredOptions = options.filter(option =>
    !searchTerm || option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="app-header">
        <h1>Рандомайзер решений</h1>
        <p className="app-description">
          Не можете принять решение? Предоставьте это нам!
        </p>
      </div>
      
      <div className="categories-wrapper">
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
          <button 
            className="add-category-btn"
            onClick={() => setShowAddCategory(!showAddCategory)}
          >
            {showAddCategory ? '×' : '+ Добавить категорию'}
          </button>
        </div>
      </div>

      {showAddCategory && (
        <div className="add-category-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Ключ категории (англ.)"
              value={newCategory.key}
              onChange={(e) => setNewCategory({ ...newCategory, key: e.target.value })}
            />
            <input
              type="text"
              placeholder="Название категории"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <button onClick={addCustomCategory}>Добавить</button>
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="options-section">
          <div className="section-header">
            <h2>{categories[selectedCategory]}</h2>
            <div className="section-actions">
              <div className="search-bar">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Поиск по вариантам..."
                />
              </div>
            </div>
          </div>
          
          <div className="add-option">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="✨ Добавить новый вариант"
            />
            <button onClick={addOption}>Добавить</button>
          </div>

          <div className="options-list">
            {filteredOptions.map((option, index) => (
              <div key={index} className="option-item">
                <span>{option}</span>
                <div className="option-actions">
                  <button 
                    className={`favorite-btn ${favorites.includes(option) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(option)}
                  >
                    ★
                  </button>
                  <button 
                    className="remove-option"
                    onClick={() => removeOption(index)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            className={`random-btn ${isSpinning ? 'spinning' : ''}`} 
            onClick={getRandomOption}
            disabled={isSpinning || filteredOptions.length === 0}
          >
            {isSpinning ? '🎲 Выбираем...' : '🎲 Выбрать случайный вариант'}
          </button>

          {result && (
            <div className={`result ${isSpinning ? 'spinning' : ''}`}>
              <h3>Результат:</h3>
              <div className="result-text">{result}</div>
              {!favorites.includes(result) && (
                <button 
                  className="add-to-favorites"
                  onClick={() => toggleFavorite(result)}
                >
                  ⭐ Добавить в избранное
                </button>
              )}
            </div>
          )}

          <div className="sections-container">
            <div className="toggle-history">
              <button onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? '📜 Скрыть историю' : '📜 Показать историю'}
              </button>
            </div>

            {showHistory && history.length > 0 && (
              <div className="history-section">
                <h3>📝 История выборов</h3>
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

            {favorites.length > 0 && (
              <div className="favorites-section">
                <h3>⭐ Избранное</h3>
                <div className="favorites-list">
                  {favorites.map((favorite, index) => (
                    <div key={index} className="favorite-item">
                      <span>{favorite}</span>
                      <button 
                        className="remove-favorite"
                        onClick={() => toggleFavorite(favorite)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
