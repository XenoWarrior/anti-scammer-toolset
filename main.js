const { app, BrowserWindow } = require("electron");

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.loadFile(__dirname + "/dist/index.html");

    // Open the DevTools.
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow);