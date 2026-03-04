import { useState, useEffect } from 'react';
import './FlipCard.css';

export function FlipCard({ winner, isFlipping, selectedPrize }) {
  const [showWinner, setShowWinner] = useState(false);
  const [shouldFlip, setShouldFlip] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      setShowWinner(false);
      setShouldFlip(false);

      // 鼓聲結束後才翻牌（3 秒）
      const flipTimer = setTimeout(() => {
        setShouldFlip(true);
      }, 3000);

      // 翻轉動畫進行到一半時顯示得獎者
      const showTimer = setTimeout(() => {
        setShowWinner(true);
      }, 3000 + 400);

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(showTimer);
      };
    } else {
      setShouldFlip(false);
    }
  }, [isFlipping, winner]);

  return (
    <div className="flip-card-container">
      <div className={`flip-card ${shouldFlip && winner ? 'flipping' : ''}`}>
        <div className="flip-card-inner">
          {/* 正面 - 問號 */}
          <div className="flip-card-front">
            <div className="card-content">
              <span className="question-mark">?</span>
              <span className="draw-hint">
                {selectedPrize ? '按空白鍵抽獎' : '請先選擇獎項'}
              </span>
            </div>
          </div>

          {/* 背面 - 得獎者 */}
          <div className="flip-card-back">
            <div className="card-content">
              {showWinner && winner && (
                <>
                  <span className="winner-prize">{selectedPrize?.name}</span>
                  <span className="winner-name">{winner.name}</span>
                  <span className="winner-department">{winner.department}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
