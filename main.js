require('dotenv').config();
const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu } = require('electron');
const path = require('path');
const GeminiHandler = require('./gemini');

let mainWindow;
let tray = null;
const gemini = new GeminiHandler(process.env.GEMINI_API_KEY);

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 700,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // no taskbar
  tray = new Tray(path.join(__dirname, 'tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => mainWindow.show() },
    { label: 'Hide', click: () => mainWindow.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Ghost AI');
  tray.setContextMenu(contextMenu);

  // gemini call
  ipcMain.handle('gemini-request', async (_, prompt) => {
    const response = await gemini.getResponse(prompt);
    console.log('Full Gemini Response:', response);
    return response;
  });

  globalShortcut.register('Control+Alt+C', () => {
    const newOpacity = Math.min(1.0, mainWindow.getOpacity() + 0.1);
    mainWindow.setOpacity(newOpacity);
    mainWindow.webContents.send('opacity-update', newOpacity);
  });

  globalShortcut.register('Control+Alt+Z', () => {
    const newOpacity = Math.max(0.1, mainWindow.getOpacity() - 0.1);
    mainWindow.setOpacity(newOpacity);
    mainWindow.webContents.send('opacity-update', newOpacity);
  });

  mainWindow.loadFile('index.html');
  mainWindow.setOpacity(0.85);
  mainWindow.setContentProtection(true);

  mainWindow.on('closed', () => app.quit());
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
