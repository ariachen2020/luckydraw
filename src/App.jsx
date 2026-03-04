import { useState, useCallback, useEffect } from 'react';
import { prizes as initialPrizes, participants as defaultParticipants } from './data/testData';
import { useKeyboardTrigger } from './hooks/useKeyboardTrigger';
import { useSoundEffects } from './hooks/useSoundEffects';
import { PrizeSelector } from './components/PrizeSelector';
import { MultiFlipCard } from './components/MultiFlipCard';
import { WinnerDisplay } from './components/WinnerDisplay';
import { WinnerExportModal } from './components/WinnerExportModal';
import { BonusPrizeModal } from './components/BonusPrizeModal';
import { DataUploader } from './components/DataUploader';
import './App.css';

function App() {
  // 當前選擇的獎項
  const [selectedPrize, setSelectedPrize] = useState(null);
  // 每個獎項的得獎者 { prizeId: [winner1, winner2, ...] }
  const [prizeWinners, setPrizeWinners] = useState({});
  // 當前得獎者們（用於顯示在卡片上）
  const [currentWinners, setCurrentWinners] = useState([]);
  // 卡片是否正在翻轉
  const [isFlipping, setIsFlipping] = useState(false);
  // 抽獎模式：'single' 一張一張抽, 'all' 一次全抽
  const [drawMode, setDrawMode] = useState('single');
  // 當前輪次
  const [currentRound, setCurrentRound] = useState(1);
  // 獎項列表（可重置）
  const [prizes, setPrizes] = useState(initialPrizes);
  // 輸出名單彈窗
  const [showExportModal, setShowExportModal] = useState(false);
  // 加碼獎設定彈窗
  const [showBonusModal, setShowBonusModal] = useState(false);
  // 參與者名單（可由上傳功能更新）
  const [participants, setParticipants] = useState(defaultParticipants);

  // 音效
  const { playDrumRoll, playWinSound, setCustomDrumSound, setCustomWinSound } = useSoundEffects();

  // 設定自訂音效（使用 import.meta.env.BASE_URL 取得正確路徑）
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    setCustomDrumSound(`${base}u_xg7ssi08yr-drum-roll-379670.mp3`);
    setCustomWinSound(`${base}freesound_community-tada-fanfare-a-6313.mp3`);
  }, [setCustomDrumSound, setCustomWinSound]);

  // 取得所有已得獎的人員 ID
  const getWonParticipantIds = useCallback(() => {
    const ids = new Set();
    Object.values(prizeWinners).forEach((winners) => {
      winners.forEach((winner) => ids.add(winner.id));
    });
    return ids;
  }, [prizeWinners]);

  // 取得可抽獎的參與者（排除已得獎者）
  const getAvailableParticipants = useCallback(() => {
    const wonIds = getWonParticipantIds();
    return participants.filter((p) => !wonIds.has(p.id));
  }, [getWonParticipantIds]);

  // 檢查當前獎項剩餘名額
  const getRemainingSlots = useCallback(() => {
    if (!selectedPrize) return 0;
    const winners = prizeWinners[selectedPrize.id] || [];
    return selectedPrize.count - winners.length;
  }, [selectedPrize, prizeWinners]);

  // 檢查當前獎項是否還有名額
  const hasRemainingSlots = useCallback(() => {
    return getRemainingSlots() > 0;
  }, [getRemainingSlots]);

  // 檢查所有獎項是否都抽完
  const isAllPrizesDrawn = useCallback(() => {
    return prizes.every((prize) => {
      const winners = prizeWinners[prize.id] || [];
      return winners.length >= prize.count;
    });
  }, [prizes, prizeWinners]);

  // 抽獎
  const draw = useCallback(() => {
    if (!selectedPrize) return;
    if (!hasRemainingSlots()) return;
    if (isFlipping) return;

    const available = getAvailableParticipants();
    if (available.length === 0) return;

    // 決定要抽幾個人
    const remainingSlots = getRemainingSlots();
    const drawCount = drawMode === 'all' ? Math.min(remainingSlots, available.length) : 1;

    // 隨機選擇得獎者
    const winners = [];
    const tempAvailable = [...available];
    for (let i = 0; i < drawCount; i++) {
      const randomIndex = Math.floor(Math.random() * tempAvailable.length);
      winners.push(tempAvailable[randomIndex]);
      tempAvailable.splice(randomIndex, 1);
    }

    // 播放抽獎鼓聲
    playDrumRoll();
    setCurrentWinners(winners);
    setIsFlipping(true);

    // 鼓聲結束後翻牌（3 秒後）
    const drumDuration = 3000;

    // 翻牌後播放中獎音效並更新得獎名單
    setTimeout(() => {
      playWinSound();
      setPrizeWinners((prev) => ({
        ...prev,
        [selectedPrize.id]: [...(prev[selectedPrize.id] || []), ...winners],
      }));
    }, drumDuration + 800);

    // 重置卡片（準備下一次抽獎）- 顯示 5 秒後翻回
    setTimeout(() => {
      setIsFlipping(false);
      setCurrentWinners([]);
    }, drumDuration + 5000);
  }, [selectedPrize, hasRemainingSlots, isFlipping, getAvailableParticipants, getRemainingSlots, drawMode, playDrumRoll, playWinSound]);

  // 監聽空白鍵
  useKeyboardTrigger(
    draw,
    ' ', // 空白鍵
    1000, // 1 秒冷卻
    selectedPrize !== null && !isFlipping && hasRemainingSlots()
  );

  // 開啟加碼獎設定彈窗
  const openBonusModal = useCallback(() => {
    setShowBonusModal(true);
  }, []);

  // 確認加碼獎設定並開始新一輪
  const confirmBonusRound = useCallback((newPrizes) => {
    setPrizes(newPrizes);
    setPrizeWinners({});
    setSelectedPrize(null);
    setCurrentWinners([]);
    setCurrentRound((prev) => prev + 1);
    setShowBonusModal(false);
  }, []);

  // 取消加碼獎設定
  const cancelBonusModal = useCallback(() => {
    setShowBonusModal(false);
  }, []);

  // 上傳名單後更新參與者
  const handleDataLoaded = useCallback((newParticipants) => {
    setParticipants(newParticipants);
    // 重置抽獎狀態
    setPrizeWinners({});
    setSelectedPrize(null);
    setCurrentWinners([]);
  }, []);

  // 計算統計資料
  const totalWinners = Object.values(prizeWinners).reduce(
    (sum, winners) => sum + winners.length,
    0
  );
  const remainingParticipants = participants.length - totalWinners;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">春酒抽獎</h1>
        <div className="header-right">
          <DataUploader
            onDataLoaded={handleDataLoaded}
            currentParticipantCount={participants.length}
          />
          <div className="app-stats">
            <span className="round-badge">第 {currentRound} 輪</span>
            <span>參與人數：{participants.length} 人</span>
            <span>已抽出：{totalWinners} 人</span>
            <span>剩餘：{remainingParticipants} 人</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* 左側：抽獎區（放大） */}
        <section className="draw-section">
          <MultiFlipCard
            winners={currentWinners}
            isFlipping={isFlipping}
            selectedPrize={selectedPrize}
          />

          <div className="draw-hint">
            <p>按下空白鍵開始抽獎</p>
          </div>
        </section>

        {/* 右側：獎項選擇 + 得獎名單 */}
        <aside className="sidebar">
          <PrizeSelector
            prizes={prizes}
            selectedPrize={selectedPrize}
            onSelect={setSelectedPrize}
            prizeWinners={prizeWinners}
            drawMode={drawMode}
            onDrawModeChange={setDrawMode}
          />

          <WinnerDisplay prizes={prizes} prizeWinners={prizeWinners} />

          {/* 功能按鈕區 */}
          <div className="action-buttons">
            {isAllPrizesDrawn() && (
              <>
                <button className="action-btn export-btn" onClick={() => setShowExportModal(true)}>
                  輸出名單
                </button>
                <button className="action-btn bonus-btn" onClick={openBonusModal}>
                  加碼獎（第 {currentRound + 1} 輪）
                </button>
              </>
            )}
          </div>
        </aside>
      </main>

      {/* 輸出名單彈窗 */}
      {showExportModal && (
        <WinnerExportModal
          prizes={prizes}
          prizeWinners={prizeWinners}
          currentRound={currentRound}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* 加碼獎設定彈窗 */}
      {showBonusModal && (
        <BonusPrizeModal
          currentRound={currentRound + 1}
          onConfirm={confirmBonusRound}
          onCancel={cancelBonusModal}
        />
      )}
    </div>
  );
}

export default App;
