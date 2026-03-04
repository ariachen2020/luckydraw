import { useState } from 'react';
import './BonusPrizeModal.css';

export function BonusPrizeModal({ currentRound, onConfirm, onCancel }) {
  const [prizes, setPrizes] = useState([
    { id: Date.now(), name: '加碼獎', count: 1, description: '' }
  ]);

  const addPrize = () => {
    setPrizes([
      ...prizes,
      { id: Date.now(), name: '', count: 1, description: '' }
    ]);
  };

  const removePrize = (id) => {
    if (prizes.length > 1) {
      setPrizes(prizes.filter(p => p.id !== id));
    }
  };

  const updatePrize = (id, field, value) => {
    setPrizes(prizes.map(p =>
      p.id === id ? { ...p, [field]: field === 'count' ? parseInt(value) || 1 : value } : p
    ));
  };

  const handleConfirm = () => {
    // 過濾掉沒有名稱的獎項
    const validPrizes = prizes.filter(p => p.name.trim() !== '');
    if (validPrizes.length === 0) {
      alert('請至少新增一個獎項');
      return;
    }
    // 重新編號 ID
    const finalPrizes = validPrizes.map((p, index) => ({
      ...p,
      id: index + 1
    }));
    onConfirm(finalPrizes);
  };

  return (
    <div className="bonus-modal-overlay">
      <div className="bonus-modal">
        <div className="bonus-modal-header">
          <h2>設定第 {currentRound} 輪獎項</h2>
          <p className="bonus-modal-hint">請設定本輪的加碼獎項</p>
        </div>

        <div className="bonus-modal-body">
          <div className="prize-list-header">
            <span className="col-name">獎項名稱</span>
            <span className="col-desc">獎品說明</span>
            <span className="col-count">名額</span>
            <span className="col-action"></span>
          </div>

          {prizes.map((prize, index) => (
            <div key={prize.id} className="prize-input-row">
              <input
                type="text"
                className="prize-input name-input"
                placeholder={`獎項 ${index + 1}`}
                value={prize.name}
                onChange={(e) => updatePrize(prize.id, 'name', e.target.value)}
              />
              <input
                type="text"
                className="prize-input desc-input"
                placeholder="獎品說明"
                value={prize.description}
                onChange={(e) => updatePrize(prize.id, 'description', e.target.value)}
              />
              <input
                type="number"
                className="prize-input count-input"
                min="1"
                value={prize.count}
                onChange={(e) => updatePrize(prize.id, 'count', e.target.value)}
              />
              <button
                className="remove-prize-btn"
                onClick={() => removePrize(prize.id)}
                disabled={prizes.length === 1}
                title="移除此獎項"
              >
                ✕
              </button>
            </div>
          ))}

          <button className="add-prize-btn" onClick={addPrize}>
            + 新增獎項
          </button>
        </div>

        <div className="bonus-modal-footer">
          <button className="modal-btn cancel-btn" onClick={onCancel}>
            取消
          </button>
          <button className="modal-btn confirm-btn" onClick={handleConfirm}>
            開始第 {currentRound} 輪
          </button>
        </div>
      </div>
    </div>
  );
}
