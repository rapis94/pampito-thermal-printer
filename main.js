const { app, BrowserWindow } = require("electron");
const path = require("path");

// Tu backend
require("./index.js"); // Aquí se lanza tu servidor Express

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // para acceder a Node desde el front
            contextIsolation: false,
        },
    });

    win.loadURL("http://localhost:5000"); // O una interfaz local
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
