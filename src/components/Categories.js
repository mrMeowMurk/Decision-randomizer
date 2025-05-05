import React from 'react';

/**
 * Компонент отображения и управления категориями
 * 
 * @component
 * @param {Object} props - Свойства компонента
 * @param {Object} props.categories - Объект со всеми категориями (ключ: название)
 * @param {string} props.selectedCategory - Ключ выбранной категории
 * @param {Object} props.categoryStats - Статистика использования категорий
 * @param {Object} props.defaultCategories - Объект с предустановленными категориями
 * @param {Function} props.onCategoryChange - Обработчик выбора категории
 * @param {Function} props.onDeleteCategory - Обработчик удаления категории
 * @param {boolean} props.showAddCategory - Флаг отображения формы добавления категории
 * @param {Function} props.setShowAddCategory - Функция управления отображением формы
 */
const Categories = ({ 
  categories, 
  selectedCategory, 
  categoryStats, 
  defaultCategories,
  onCategoryChange,
  onDeleteCategory,
  showAddCategory,
  setShowAddCategory
}) => {
  return (
    <div className="categories-wrapper">
      <div className="categories">
        {/* Отображение списка категорий */}
        {Object.entries(categories).map(([key, value]) => (
          <div key={key} className="category-btn-wrapper">
            {/* Кнопка категории с бейджем использований */}
            <button
              className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => onCategoryChange(key)}
              title={`Выбрать категорию "${value}"`}
            >
              <span className="category-name">{value}</span>
              {categoryStats[key] > 0 && (
                <span className="category-usage-badge" title={`Использовано ${categoryStats[key]} раз`}>
                  {categoryStats[key]}
                </span>
              )}
            </button>
            
            {/* Кнопка удаления для пользовательских категорий */}
            {!defaultCategories.hasOwnProperty(key) && (
              <button
                className="remove-category"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteCategory(key, 'category');
                }}
                title="Удалить категорию"
                aria-label={`Удалить категорию "${value}"`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {/* Кнопка добавления новой категории */}
        <button 
          className="add-category-btn"
          onClick={() => setShowAddCategory(!showAddCategory)}
          title={showAddCategory ? 'Отменить добавление' : 'Добавить новую категорию'}
        >
          {showAddCategory ? '×' : '+ Добавить категорию'}
        </button>
      </div>
    </div>
  );
};

export default Categories; 