# Change Log

## 2026-03-04

### UI 調整
- 將頁首標題與統計資訊改為垂直堆疊排列
  - `.app-header` 加入 `flex-direction: column`
  - 標題「春酒抽獎」在上，統計資訊在下，置中對齊
  - 調整 `gap` 為 `0.5rem` 讓間距更緊湊

### 部署
- 上傳專案至 GitHub 並設定 GitHub Pages

### 音效修復
- 修復 GitHub Pages 上音效無法播放的問題（瀏覽器自動播放政策）
  - 加入音效預載入（`preload: 'auto'`）
  - 用戶第一次互動（點擊/按鍵/觸控）後解鎖音效

### 資料匯入
- 支援 Excel (.xlsx) 與 ODS (.ods) 檔案上傳參與者名單
- 已知問題：Excel 格式目前無法正常匯入，ODS 格式可正常使用
- 注意：正式名單需另外上傳，不包含在程式碼中

### 檔案變更
- `src/App.css` - 修改 `.app-header` 樣式為垂直排列

---

## 2026-02-27

### UI 調整
- 整體畫面置中顯示，設定 `max-width: 1600px` 並用 `margin: 0 auto` 置中
- 主內容區加入 `justify-content: center` 讓左右兩欄在容器中置中
- 抽獎區設定 `max-width: 800px` 避免單一卡片時拉得太寬
- 新增超寬螢幕（1800px 以上）的響應式規則優化顯示

### 加碼獎功能
- 新增 `BonusPrizeModal` 元件：進入第二輪時可自訂新獎項
  - 可輸入獎項名稱、獎品說明、名額
  - 支援新增/移除多個獎項
  - 確認後清空第一輪獎項，使用新設定的獎項開始新一輪

### 檔案變更
- `src/App.css` - 調整佈局置中樣式
- `src/index.css` - 移除 body 的 flex 置中避免衝突
- `src/App.jsx` - 整合加碼獎設定功能
- `src/components/BonusPrizeModal.jsx` - 新增加碼獎設定彈窗元件
- `src/components/BonusPrizeModal.css` - 加碼獎彈窗樣式

---

## 待辦事項
- [ ] 匯入正式獎項資料
- [ ] 匯入正式參與者名單
