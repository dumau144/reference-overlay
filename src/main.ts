import { app, BrowserWindow } from "electron";
import * as path from "path";

function createWindow() {
  const mainWindow = new BrowserWindow({
    // transparent: true,
    // autoHideMenuBar: true,
    // height: 600,
    // width: 800,
    // fullscreen: true,
    // kiosk: true,
    // closable: false,
    // frame: false,
    // focusable: false,
    // skipTaskbar: true,
    // alwaysOnTop: true,
    // title: "Title",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // mainWindow.setIgnoreMouseEvents(true);

  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  mainWindow.webContents.openDevTools();
}

// app.commandLine.appendSwitch("enable-transparent-visuals");

// app.commandLine.appendSwitch("disable-gpu");

app.on("ready", () => {
  setTimeout(() => {
    createWindow();
  }, 200);
  // app.on("activate", function () {
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow();
  // });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
