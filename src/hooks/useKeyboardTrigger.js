import { useEffect, useRef, useCallback } from 'react';

/**
 * 監聽鍵盤按鍵觸發的 Hook
 * @param {Function} callback - 觸發時執行的回調函數
 * @param {string} targetKey - 監聽的按鍵，預設為空白鍵 ' '
 * @param {number} debounceMs - 防止連續觸發的間隔時間（毫秒），預設 1500ms
 * @param {boolean} enabled - 是否啟用監聽，預設 true
 */
export function useKeyboardTrigger(
  callback,
  targetKey = ' ',
  debounceMs = 1500,
  enabled = true
) {
  const lastTriggerTime = useRef(0);
  const callbackRef = useRef(callback);

  // 保持 callback 最新
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;
      if (event.key !== targetKey) return;

      // 防止瀏覽器預設行為（例如空白鍵捲動頁面）
      event.preventDefault();

      const now = Date.now();
      if (now - lastTriggerTime.current < debounceMs) {
        return; // 還在冷卻時間內，忽略
      }

      lastTriggerTime.current = now;
      callbackRef.current();
    },
    [targetKey, debounceMs, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}
