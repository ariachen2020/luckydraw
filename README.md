# 春酒抽獎系統

公司春酒活動專用的抽獎程式，支援多獎項、多輪次抽獎。

## Demo

https://ariachen2020.github.io/luckydraw/

## 功能特色

- 多獎項設定（特獎、頭獎、二獎、三獎、普獎）
- 支援單抽與全抽模式
- 翻牌動畫效果
- 抽獎音效（鼓聲 + 中獎音效）
- 加碼獎功能（可進行多輪抽獎）
- 得獎名單輸出
- 支援 ODS 格式匯入參與者名單

## 使用方式

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
 

# 建置專案
npm run build
```

### 匯入參與者名單

1. 準備 ODS 格式的名單檔案（LibreOffice Calc）
2. 欄位格式：員工編號、姓名、部門代碼
3. 點擊右下角「上傳名單」按鈕匯入

> 注意：目前 Excel (.xlsx) 格式有相容性問題，建議使用 ODS 格式

### 操作說明

1. 選擇要抽的獎項
2. 選擇抽獎模式（單抽 / 全抽）
3. 按下**空白鍵**開始抽獎
4. 等待翻牌動畫完成
5. 繼續抽下一位或切換獎項

## 部署

專案使用 GitHub Actions 自動部署到 GitHub Pages。

推送到 `main` 分支後會自動觸發部署。

## 技術架構

- React 18
- Vite
- Web Audio API（音效）
- CSS Animations（翻牌動畫）

## 檔案結構

```
src/
├── App.jsx              # 主程式
├── App.css              # 主樣式
├── components/
│   ├── MultiFlipCard.jsx    # 翻牌元件
│   ├── PrizeSelector.jsx    # 獎項選擇
│   ├── WinnerDisplay.jsx    # 得獎名單
│   ├── WinnerExportModal.jsx # 輸出名單彈窗
│   ├── BonusPrizeModal.jsx  # 加碼獎設定
│   └── DataUploader.jsx     # 名單上傳
├── hooks/
│   ├── useKeyboardTrigger.js # 鍵盤監聽
│   └── useSoundEffects.js    # 音效管理
└── data/
    └── defaultData.js       # 預設獎項設定
```

## 已知問題

- Excel (.xlsx) 格式匯入可能失敗，請使用 ODS 格式
- 首次使用需點擊頁面任意處以解鎖音效（瀏覽器自動播放政策）

## License

Private - 內部使用
