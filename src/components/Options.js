import React from 'react';

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