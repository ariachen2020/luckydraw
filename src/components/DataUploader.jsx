import { useState, useRef } from 'react';
import './DataUploader.css';

// 解析 CSV 內容
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const participants = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 支援逗號或 tab 分隔
    const cells = line.includes('\t') ? line.split('\t') : line.split(',');
    if (cells.length >= 2) {
      const department = cells[0]?.trim() || '';
      const employeeId = cells[1]?.trim() || '';
      const name = cells[2]?.trim() || '(未填姓名)';

      if (department && employeeId) {
        participants.push({
          id: i,
          employeeId,
          name,
          department,
        });
      }
    }
  }
  return participants;
}

// 解析 ODS 檔案（ZIP 格式，內含 content.xml）
async function parseODS(file) {
  const JSZip = (await import('jszip')).default;
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const contentXml = await zip.file('content.xml').async('string');

  const parser = new DOMParser();
  const doc = parser.parseFromString(contentXml, 'application/xml');

  const ns = {
    table: 'urn:oasis:names:tc:opendocument:xmlns:table:1.0',
    text: 'urn:oasis:names:tc:opendocument:xmlns:text:1.0',
  };

  const rows = doc.getElementsByTagNameNS(ns.table, 'table-row');
  const participants = [];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagNameNS(ns.table, 'table-cell');
    const values = [];

    for (let j = 0; j < Math.min(cells.length, 3); j++) {
      const textNode = cells[j].getElementsByTagNameNS(ns.text, 'p')[0];
      values.push(textNode?.textContent?.trim() || '');
    }

    const department = values[0] || '';
    const employeeId = values[1] || '';
    const name = values[2] || '(未填姓名)';

    if (department && employeeId) {
      participants.push({
        id: i,
        employeeId,
        name,
        department,
      });
    }
  }

  return participants;
}

// 解析 Excel 檔案（.xlsx）
async function parseExcel(file) {
  try {
    const xlsxModule = await import('xlsx');
    // xlsx 模組可能用 default export 或直接 export
    const XLSX = xlsxModule.default || xlsxModule;

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const participants = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 2) continue;

      const department = String(row[0] || '').trim();
      const employeeId = String(row[1] || '').trim();
      const name = String(row[2] || '').trim() || '(未填姓名)';

      if (department && employeeId) {
        participants.push({
          id: i,
          employeeId,
          name,
          department,
        });
      }
    }

    return participants;
  } catch (err) {
    console.error('Excel 解析錯誤:', err);
    throw new Error('Excel 檔案解析失敗: ' + err.message);
  }
}

export function DataUploader({ onDataLoaded, currentParticipantCount }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      let participants = [];
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
        const text = await file.text();
        participants = parseCSV(text);
      } else if (fileName.endsWith('.ods')) {
        participants = await parseODS(file);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        participants = await parseExcel(file);
      } else {
        throw new Error('不支援的檔案格式，請使用 CSV、ODS 或 Excel 檔案');
      }

      if (participants.length === 0) {
        throw new Error('找不到有效的參與者資料');
      }

      onDataLoaded(participants);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      // 重置 input，讓同一個檔案可以再次上傳
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="data-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.ods,.xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className={`upload-btn ${isLoading ? 'loading' : ''}`}>
        {isLoading ? '載入中...' : '📂 上傳名單'}
      </label>
      <span className="participant-count">
        目前 {currentParticipantCount} 人
      </span>
      {error && <div className="upload-error">{error}</div>}
      <div className="upload-hint">支援 CSV、ODS、Excel</div>
    </div>
  );
}
