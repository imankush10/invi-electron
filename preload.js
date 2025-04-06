const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),

  sendToGemini: (prompt) => ipcRenderer.invoke('gemini-request', prompt),

  startDrag: (startX, startY) => ipcRenderer.send('window-drag-start', { startX, startY }),
  updateDrag: (currentX, currentY) => ipcRenderer.send('window-drag-move', { currentX, currentY }),
  endDrag: () => ipcRenderer.send('window-drag-end'),

  onOpacityUpdate: (callback) => ipcRenderer.on('opacity-update', callback)
});
