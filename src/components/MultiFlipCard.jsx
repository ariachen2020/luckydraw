import { useState, useEffect } from 'react';
import './MultiFlipCard.css';

export function MultiFlipCard({ winners, isFlipping, selectedPrize }) {
  const [showWinners, setShowWinners] = useState(false);
  const [shouldFlip, setShouldFlip] = useState(false);

  useEffect(() => {
    if (isFlipping && winners.length > 0) {
      setShowWinners(false);
      setShouldFlip(false);

      // 鼓聲結束後才翻牌（3 秒）
      const flipTimer = setTimeout(() => {
        setShouldFlip(true);
      }, 3000);

      // 翻轉動畫進行到一半時顯示得獎者
      const showTimer = setTimeout(() => {
        setShowWinners(true);
      }, 3000 + 400);

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(showTimer);
      };
    } else {
      setShouldFlip(false);
      setShowWinners(false);
    }
  }, [isFlipping, winners]);

  // 沒有正在抽獎時，顯示待機畫面
  if (!isFlipping || winners.length === 0) {
    return (
      <div className="multi-flip-container">
        <div className="flip-card single">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div className="card-content">
                <span className="question-mark">?</span>
                <span className="card-hint">
                  {selectedPrize ? `${selectedPrize.name} - 按空白鍵抽獎` : '請先選擇獎項'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 根據卡片數量決定大小
  const getCardSize = (count) => {
    if (count === 1) return 'single';
    if (count <= 3) return 'medium';
    if (count <= 6) return 'small';
    return 'tiny';
  };

  const cardSize = getCardSize(winners.length);

  return (
    <div className={`multi-flip-container ${cardSize}`}>
      {winners.map((winner, index) => (
        <div
          key={winner.id}
          className={`flip-card ${cardSize} ${shouldFlip ? 'flipping' : ''}`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flip-card-inner">
            {/* 正面 - 問號 */}
            <div className="flip-card-front">
              <div className="card-content">
                <span className="question-mark">?</span>
              </div>
            </div>

            {/* 背面 - 得獎者 */}
            <div className="flip-card-back">
              <div className="card-content">
                {showWinners && (
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
      ))}
    </div>
  );
}
