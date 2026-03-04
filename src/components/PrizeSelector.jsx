import './PrizeSelector.css';

export function PrizeSelector({ prizes, selectedPrize, onSelect, prizeWinners, drawMode, onDrawModeChange }) {
  // 計算每個獎項已抽出的人數
  const getDrawnCount = (prizeId) => {
    return prizeWinners[prizeId]?.length || 0;
  };

  // 計算剩餘名額
  const getRemainingCount = (prize) => {
    return prize.count - getDrawnCount(prize.id);
  };

  return (
    <div className="prize-selector">
      <h2 className="prize-selector-title">選擇獎項</h2>

      {/* 抽獎模式切換 */}
      <div className="draw-mode-toggle">
        <button
          className={`mode-btn ${drawMode === 'single' ? 'active' : ''}`}
          onClick={() => onDrawModeChange('single')}
        >
          單抽
        </button>
        <button
          className={`mode-btn ${drawMode === 'all' ? 'active' : ''}`}
          onClick={() => onDrawModeChange('all')}
        >
          全抽
        </button>
      </div>

      <div className="prize-buttons">
        {prizes.map((prize) => {
          const remaining = getRemainingCount(prize);
          const isSelected = selectedPrize?.id === prize.id;
          const isExhausted = remaining <= 0;

          return (
            <button
              key={prize.id}
              className={`prize-button ${isSelected ? 'selected' : ''} ${isExhausted ? 'exhausted' : ''}`}
              onClick={() => !isExhausted && onSelect(prize)}
              disabled={isExhausted}
            >
              <span className="prize-name">{prize.name}</span>
              <span className="prize-description">{prize.description}</span>
              <span className="prize-count">
                剩餘 {remaining} / {prize.count} 名
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
