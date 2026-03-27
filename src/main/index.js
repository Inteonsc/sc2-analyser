import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import fs from "fs";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import Store from "electron-store";
import path from "path";
import { SC2Replay } from "sc2js";

const store = new Store();

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: path.join(__dirname, "../preload/index.js"),
            sandbox: false
        }
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    }
}

function findReplays(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findReplays(fullPath));
        } else if (entry.name.endsWith(".SC2Replay")) {
            results.push(fullPath);
        }
    }
    return results;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // IPC Handlers
    ipcMain.handle("get-replay-folder", () => {
        return store.get("replayFolder", null);
    });
    ipcMain.handle("pick-replay-folder", async () => {
        const replayPath = await dialog.showOpenDialog({ properties: ["openDirectory"] });
        if (replayPath.canceled) {
            return null;
        } else {
            return replayPath.filePaths[0];
        }
    });
    ipcMain.handle("get-default-path", () => {
        return path.join(app.getPath("documents"), "StarCraft II", "Accounts");
    });
    ipcMain.handle("save-replay-folder", (_, folderPath) => {
        store.set("replayFolder", folderPath);
    });
    ipcMain.handle("get-theme", () => {
        return store.get("theme", "blue");
    });
    ipcMain.handle("save-theme", (_, theme) => {
        if (theme) {
            store.set("theme", theme);
        }
    });

    ipcMain.handle("scan-replays", () => {
        //TODO need to add filter functionality
        const replaylocations = findReplays(store.get("replayFolder"));
        const replays = [];
        const length = replaylocations.length;
        const log = [];
        let i = 0;
        for (const location of replaylocations) {
            const replay = new SC2Replay(location);
            //checks for metadata (very old replays dont have and we cant deal with them atm. also affects wol training files)
            const metadata = replay.getMetadata();
            if (!metadata) {
                //console.log("skipping: ", location);
                log.push({ type: "No Metadata", path: location });
                continue;
            }
            const info = replay.getBasicInfo();
            if (info.gamemode.gamemode == "Unknown") {
                log.push({ type: "No Gamespeed", path: location });
            }
            i++;
            if (i % 50 == 0) {
                console.log("finished ", i, " out of ", length);
            }
            replays.push(info);
        }
        if (log.length > 0) {
            const logPath = path.join(app.getPath("userData"), "scan-issues.log");
            const lines = log.map((l) => JSON.stringify(l)).join("\n");
            fs.writeFileSync(logPath, lines);
        }
        return replays;
    });

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
