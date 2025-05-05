import React from 'react';

const History = ({ history, showHistory, setShowHistory }) => {
  return (
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
  );
};

export default History; 