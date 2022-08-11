const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");
let appWindow
function initWindow() {
  appWindow = new BrowserWindow({
    width: 1000,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, `../assets/icon.icns`),
  })
  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `../../dist/frontend/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Initialize the DevTools.
  appWindow.webContents.openDevTools()
  appWindow.on('closed', function () {
    appWindow = null
  })
}
app.on('ready', initWindow)

const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'Notification from the Main process'

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

app.on('finish', showNotification)

// Close when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
  if (win === null) {
    initWindow()
  }
})