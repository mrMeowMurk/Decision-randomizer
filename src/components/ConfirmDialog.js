import React from 'react';

const ConfirmDialog = ({ 
  show, 
  itemToDelete, 
  categories, 
  onConfirm, 
  onCancel 
}) => {
  if (!show) return null;

  return (
    <div className="confirm-dialog" onClick={(e) => {
      if (e.target.className === 'confirm-dialog') {
        onCancel();
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
          <button onClick={onConfirm}>Удалить</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 