import './WinnerDisplay.css';

export function WinnerDisplay({ prizes, prizeWinners }) {
  // 檢查是否有任何得獎者
  const hasAnyWinner = Object.values(prizeWinners).some(
    (winners) => winners.length > 0
  );

  return (
    <div className="winner-display">
      <h2 className="winner-display-title">得獎名單</h2>
      <div className="winner-list">
        {!hasAnyWinner && (
          <div className="no-winner-yet">
            <span className="no-winner-icon">🎁</span>
            <p>尚未抽出得獎者</p>
            <p className="no-winner-hint">選擇獎項後按空白鍵開始抽獎</p>
          </div>
        )}
        {prizes.map((prize) => {
          const winners = prizeWinners[prize.id] || [];
          if (winners.length === 0) return null;

          return (
            <div key={prize.id} className="prize-winners">
              <h3 className="prize-winner-title">
                {prize.name} - {prize.description}
              </h3>
              <div className="winners">
                {winners.map((winner, index) => (
                  <div key={winner.id} className="winner-item">
                    <span className="winner-index">{index + 1}</span>
                    <span className="winner-info">
                      {winner.name}
                      <span className="winner-dept">({winner.department})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
