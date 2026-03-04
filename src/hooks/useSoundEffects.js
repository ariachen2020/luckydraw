import { useRef, useCallback } from 'react';

/**
 * 音效管理 Hook
 * 預設使用 Web Audio API 產生合成音效
 * 可替換成自訂音效檔案
 */
export function useSoundEffects() {
  const audioContextRef = useRef(null);
  const drumAudioRef = useRef(null);
  const winAudioRef = useRef(null);

  // 初始化 AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // 播放抽獎鼓聲（緊張的滾動音效）
  const playDrumRoll = useCallback(() => {
    // 如果有自訂音效檔案，優先使用
    if (drumAudioRef.current) {
      drumAudioRef.current.currentTime = 0;
      drumAudioRef.current.play().catch(() => {});
      return;
    }

    // 使用 Web Audio API 合成鼓聲
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 1.8;  // 延長鼓聲時間
    const beatCount = 20;  // 增加鼓點數量

    for (let i = 0; i < beatCount; i++) {
      const beatTime = now + (i * duration / beatCount);

      // 低頻鼓聲
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80 + (i * 5), beatTime);
      osc.frequency.exponentialRampToValueAtTime(40, beatTime + 0.05);

      gain.gain.setValueAtTime(0.3, beatTime);
      gain.gain.exponentialRampToValueAtTime(0.01, beatTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(beatTime);
      osc.stop(beatTime + 0.06);
    }
  }, [getAudioContext]);

  // 播放中獎慶祝音效
  const playWinSound = useCallback(() => {
    // 如果有自訂音效檔案，優先使用
    if (winAudioRef.current) {
      winAudioRef.current.currentTime = 0;
      winAudioRef.current.play().catch(() => {});
      return;
    }

    // 使用 Web Audio API 合成慶祝音效（上升的和弦）
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 慶祝和弦音符 (C-E-G-C)
    const notes = [262, 330, 392, 523];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });

    // 加入閃亮的高音點綴
    setTimeout(() => {
      const sparkles = [880, 1047, 1319, 1568];
      sparkles.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    }, 400);
  }, [getAudioContext]);

  // 設定自訂音效檔案（加入預載入）
  const setCustomDrumSound = useCallback((url) => {
    const audio = new Audio(url);
    audio.volume = 0.7;
    audio.preload = 'auto';
    // 預載入音效
    audio.load();
    drumAudioRef.current = audio;
  }, []);

  const setCustomWinSound = useCallback((url) => {
    const audio = new Audio(url);
    audio.volume = 0.7;
    audio.preload = 'auto';
    // 預載入音效
    audio.load();
    winAudioRef.current = audio;
  }, []);

  // 解鎖音效（需要在用戶互動後呼叫）
  const unlockAudio = useCallback(() => {
    // 嘗試播放並立即暫停來解鎖瀏覽器的自動播放限制
    if (drumAudioRef.current) {
      drumAudioRef.current.play().then(() => {
        drumAudioRef.current.pause();
        drumAudioRef.current.currentTime = 0;
      }).catch(() => {});
    }
    if (winAudioRef.current) {
      winAudioRef.current.play().then(() => {
        winAudioRef.current.pause();
        winAudioRef.current.currentTime = 0;
      }).catch(() => {});
    }
    // 也初始化 AudioContext
    getAudioContext();
  }, [getAudioContext]);

  return {
    playDrumRoll,
    playWinSound,
    setCustomDrumSound,
    setCustomWinSound,
    unlockAudio,
  };
}
