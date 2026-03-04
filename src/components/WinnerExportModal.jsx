import { useState } from 'react';
import './WinnerExportModal.css';

export function WinnerExportModal({ prizes, prizeWinners, currentRound, onClose }) {
  const [copied, setCopied] = useState(false);

  // 產生名單文字
  const generateWinnerText = () => {
    let text = `=== 第 ${currentRound} 輪抽獎結果 ===\n\n`;

    prizes.forEach((prize) => {
      const winners = prizeWinners[prize.id] || [];
      if (winners.length > 0) {
        text += `【${prize.name}】${prize.description}\n`;
        winners.forEach((winner, index) => {
          text += `  ${index + 1}. ${winner.name} (${winner.department})\n`;
        });
        text += '\n';
      }
    });

    return text;
  };

  // 複製到剪貼簿
  const handleCopy = async () => {
    const text = generateWinnerText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('複製失敗:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>第 {currentRound} 輪抽獎結果</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="winner-list-export">
            {prizes.map((prize) => {
              const winners = prizeWinners[prize.id] || [];
              if (winners.length === 0) return null;

              return (
                <div key={prize.id} className="export-prize-group">
                  <h3 className="export-prize-title">
                    {prize.name} - {prize.description}
                  </h3>
                  <div className="export-winners">
                    {winners.map((winner, index) => (
                      <div key={winner.id} className="export-winner-item">
                        <span className="export-winner-index">{index + 1}</span>
                        <span className="export-winner-name">{winner.name}</span>
                        <span className="export-winner-dept">{winner.department}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '已複製！' : '複製名單'}
          </button>
          <button className="close-btn" onClick={onClose}>
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
