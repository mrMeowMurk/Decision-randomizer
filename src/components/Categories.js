import React from 'react';

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
        {Object.entries(categories).map(([key, value]) => (
          <div key={key} className="category-btn-wrapper">
            <button
              className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => onCategoryChange(key)}
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
                  onDeleteCategory(key, 'category');
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
  );
};

export default Categories; 