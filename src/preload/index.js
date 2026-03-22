import { contextBridge, ipcRenderer } from "electron";
// Custom APIs for renderer
const api = {
    getReplayFolder: () => ipcRenderer.invoke("get-replay-folder"),
    pickReplayFolder: () => ipcRenderer.invoke("pick-replay-folder"),
    getDefaultPath: () => ipcRenderer.invoke("get-default-path"),
    saveReplayFolder: (folderPath) => ipcRenderer.invoke("save-replay-folder", folderPath),
    getTheme: () => ipcRenderer.invoke("get-theme"),
    saveTheme: (theme) => ipcRenderer.invoke("save-theme", theme)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    window.api = api;
}
