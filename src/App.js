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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [categoryStats, setCategoryStats] = useState({});

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
    const savedStats = localStorage.getItem('randomizer-stats');
    
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedCategories) setCustomCategories(JSON.parse(savedCategories));
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme);
      setIsDarkMode(isDark);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
    if (savedStats) setCategoryStats(JSON.parse(savedStats));
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

  const confirmDelete = (item, type) => {
    setItemToDelete({ item, type });
    setShowConfirmDialog(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'category') {
      removeCategory(itemToDelete.item);
    } else if (itemToDelete.type === 'option') {
      removeOption(itemToDelete.item);
    }

    setShowConfirmDialog(false);
    setItemToDelete(null);
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
          
          updateCategoryStats(selectedCategory);
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

  const removeCategory = (categoryKey) => {
    if (defaultCategories.hasOwnProperty(categoryKey)) return;

    const newCustomCategories = { ...customCategories };
    delete newCustomCategories[categoryKey];
    setCustomCategories(newCustomCategories);
    localStorage.setItem('randomizer-categories', JSON.stringify(newCustomCategories));

    if (selectedCategory === categoryKey) {
      setSelectedCategory('');
      setOptions([]);
      setResult('');
    }
  };

  const updateCategoryStats = (category) => {
    const newStats = {
      ...categoryStats,
      [category]: (categoryStats[category] || 0) + 1
    };
    setCategoryStats(newStats);
    localStorage.setItem('randomizer-stats', JSON.stringify(newStats));
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="main-content">
        <div className="content-area">
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

          <div className="categories-wrapper">
            <div className="categories">
              {Object.entries(categories).map(([key, value]) => (
                <div key={key} className="category-btn-wrapper">
                  <button
                    className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(key)}
                  >
                    <span className="category-name">{value}</span>
                    {categoryStats[key] > 0 && (
                      <span className="category-usage-badge" title="Количество использований">
                        {categoryStats[key]}
                      </span>
                    )}
                  </button>
                  {!defaultCategories.hasOwnProperty(key) && (
                    <button
                      className="remove-category"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmDelete(key, 'category');
                      }}
                      title="Удалить категорию"
                    >
                      ×
                    </button>
                  )}
                </div>
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
                        onClick={() => confirmDelete(index, 'option')}
                        title="Удалить вариант"
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

        <div className="history-sidebar">
          <div className="history-header">
            <h3>📝 История выборов</h3>
            <button 
              className="toggle-history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Скрыть' : 'Показать'}
            </button>
          </div>
          
          {showHistory && history.length > 0 && (
            <div className="history-content">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-item-category">{item.category}</div>
                  <div className="history-item-result">{item.result}</div>
                  <div className="history-item-time">{item.timestamp}</div>
                </div>
              ))}
            </div>
          )}
          {(!showHistory || history.length === 0) && (
            <div className="history-empty">
              {history.length === 0 ? 'История пуста' : 'История скрыта'}
            </div>
          )}
        </div>
      </div>

      {showConfirmDialog && (
        <div className="confirm-dialog" onClick={(e) => {
          if (e.target.className === 'confirm-dialog') {
            setShowConfirmDialog(false);
            setItemToDelete(null);
          }
        }}>
          <div className="confirm-dialog-content">
            <h3>Подтверждение удаления</h3>
            <p>
              {itemToDelete?.type === 'category' 
                ? `Вы уверены, что хотите удалить категорию "${categories[itemToDelete.item]}"?`
                : 'Вы уверены, что хотите удалить этот элемент?'}
            </p>
            <div className="confirm-dialog-buttons">
              <button onClick={handleDelete}>Удалить</button>
              <button onClick={() => {
                setShowConfirmDialog(false);
                setItemToDelete(null);
              }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
