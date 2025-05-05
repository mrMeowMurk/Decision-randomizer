import React from 'react';

/**
 * Компонент управления опциями выбранной категории
 * 
 * @component
 * @param {Object} props - Свойства компонента
 * @param {string} props.selectedCategory - Ключ выбранной категории
 * @param {Object} props.categories - Объект со всеми категориями
 * @param {Array} props.options - Массив опций для выбранной категории
 * @param {string} props.searchTerm - Строка поиска по опциям
 * @param {Function} props.setSearchTerm - Функция изменения строки поиска
 * @param {string} props.newOption - Значение поля для новой опции
 * @param {Function} props.setNewOption - Функция изменения значения новой опции
 * @param {Function} props.onAddOption - Обработчик добавления новой опции
 * @param {Function} props.onDeleteOption - Обработчик удаления опции
 * @param {Array} props.favorites - Массив избранных опций
 * @param {Function} props.onToggleFavorite - Обработчик добавления/удаления из избранного
 * @param {boolean} props.isSpinning - Флаг процесса случайного выбора
 * @param {string} props.result - Результат случайного выбора
 * @param {Function} props.onRandomSelect - Обработчик запуска случайного выбора
 */
const Options = ({
  selectedCategory,
  categories,
  options,
  searchTerm,
  setSearchTerm,
  newOption,
  setNewOption,
  onAddOption,
  onDeleteOption,
  favorites,
  onToggleFavorite,
  isSpinning,
  result,
  onRandomSelect
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddOption();
    }
  };

  const filteredOptions = options.filter(option =>
    !searchTerm || option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
        <button onClick={onAddOption}>Добавить</button>
      </div>

      <div className="options-list">
        {filteredOptions.map((option, index) => (
          <div key={index} className="option-item">
            <span>{option}</span>
            <div className="option-actions">
              <button 
                className={`favorite-btn ${favorites.includes(option) ? 'active' : ''}`}
                onClick={() => onToggleFavorite(option)}
              >
                ★
              </button>
              <button 
                className="remove-option"
                onClick={() => onDeleteOption(index, 'option')}
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
        onClick={onRandomSelect}
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
              onClick={() => onToggleFavorite(result)}
            >
              ⭐ Добавить в избранное
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Options; 