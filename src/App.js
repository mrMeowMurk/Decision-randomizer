import React, { useState, useEffect } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import Categories from './components/Categories';
import Options from './components/Options';
import History from './components/History';
import ConfirmDialog from './components/ConfirmDialog';
import ThemeToggle from './components/ThemeToggle';

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setOptions(defaultOptions[category] || []);
    setResult('');
    setSearchTerm('');
  };

  const handleAddOption = () => {
    if (newOption.trim() && selectedCategory) {
      const newOptionText = newOption.trim();
      setOptions(prev => [...prev, newOptionText]);
      setNewOption('');
      
      const savedOptions = JSON.parse(localStorage.getItem(`randomizer-options-${selectedCategory}`) || '[]');
      localStorage.setItem(`randomizer-options-${selectedCategory}`, JSON.stringify([...savedOptions, newOptionText]));
    }
  };

  const handleDeleteOption = (index, type) => {
    setItemToDelete({ item: index, type });
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'category') {
      removeCategory(itemToDelete.item);
    } else if (itemToDelete.type === 'option') {
      removeOption(itemToDelete.item);
    }

    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddOption();
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
      <ThemeToggle 
        isDarkMode={isDarkMode} 
        onToggle={() => {
          const newTheme = !isDarkMode;
          setIsDarkMode(newTheme);
          document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
          localStorage.setItem('randomizer-theme', JSON.stringify(newTheme));
        }} 
      />

      <div className="main-content">
        <div className="content-area">
          <Welcome />
          
          <Categories 
            categories={categories}
            selectedCategory={selectedCategory}
            categoryStats={categoryStats}
            defaultCategories={defaultCategories}
            onCategoryChange={handleCategoryChange}
            onDeleteCategory={handleDeleteOption}
            showAddCategory={showAddCategory}
            setShowAddCategory={setShowAddCategory}
          />

          {selectedCategory && (
            <Options 
              selectedCategory={selectedCategory}
              categories={categories}
              options={options}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              newOption={newOption}
              setNewOption={setNewOption}
              onAddOption={handleAddOption}
              onDeleteOption={handleDeleteOption}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              isSpinning={isSpinning}
              result={result}
              onRandomSelect={getRandomOption}
            />
          )}
        </div>

        <History 
          history={history}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />
      </div>

      <ConfirmDialog 
        show={showConfirmDialog}
        itemToDelete={itemToDelete}
        categories={categories}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowConfirmDialog(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}

export default App;
