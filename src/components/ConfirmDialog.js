import React from 'react';

/**
 * Компонент диалогового окна подтверждения действия
 * 
 * @component
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.show - Флаг отображения диалога
 * @param {Object} props.itemToDelete - Объект с информацией об удаляемом элементе
 * @param {Object} props.categories - Объект со всеми категориями
 * @param {Function} props.onConfirm - Обработчик подтверждения действия
 * @param {Function} props.onCancel - Обработчик отмены действия
 * @example
 * return (
 *   <ConfirmDialog
 *     show={true}
 *     itemToDelete={{ item: 'food', type: 'category' }}
 *     categories={{ food: 'Еда' }}
 *     onConfirm={() => handleDelete()}
 *     onCancel={() => setShowDialog(false)}
 *   />
 * )
 */
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