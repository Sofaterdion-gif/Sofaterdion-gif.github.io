# Open Bell 舊版 SFML 試玩包（封存）

此檔案只供歷史參考，**不是新版 Godot 遊戲，也不是目前建議下載的版本**。新版 Windows 試玩包尚未發布。

- 檔案：`OpenBell-Playtest-Legacy-SFML.exe`
- 原始下載大小：2,883,584 bytes（2.75 MiB）
- SHA-256：`aae2e81cab7a070d842f67db55b06c62ce15cd61aab74accf10602d3d76400a0`
- Authenticode：未簽章
- 內嵌舊版主程式：`trading_game_gui.exe`，使用 SFML／OpenAL 與 MinGW runtime DLL

這是自解壓包；靜態列檔只看到舊版執行檔和 runtime DLL，未看到隨包附帶的 CSV 市場資料。主程式字串有 `file.csv` 與 `TradingSim/settings.ini` 參照，因此無法僅憑此包確認舊程式在乾淨 Windows 環境中能完整載入資料。此檔未在 Windows 實機執行；請勿用它評估新版效能或略過 Windows 安全警告。
