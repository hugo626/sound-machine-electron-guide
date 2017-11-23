const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut
} = require('electron')
// Module to control application life.
// const app = electron.app
// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
let configuration = require('./configuration');
let settingsWindow = null;

ipcMain.on('close-main-window', function() {
  app.quit();
});

ipcMain.on('open-settings-window', function() {
  console.log('Open Setting windows');
  if (settingsWindow) {
    return;
  }

  settingsWindow = new BrowserWindow({
    // frame: false,
    height: 200,
    // resizable: false,
    width: 200
  });

  // and load the index.html of the app.
  settingsWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/settings.html'),
    protocol: 'file:',
    slashes: true
  }));

  settingsWindow.on('closed', function() {
    settingsWindow = null;
  });

});

ipcMain.on('close-settings-window', function() {
  if (settingsWindow) {
    settingsWindow.close();
  }
});

ipcMain.on('set-global-shortcuts', function() {
  if (settingsWindow) {
    setGlobalShortcuts();
  }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // frame: false,
    width: 368,
    height: 700
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function setGlobalShortcuts() {
  globalShortcut.unregisterAll();

  var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
  var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

  globalShortcut.register(shortcutPrefix + '1', function () {
      mainWindow.webContents.send('global-shortcut', 0);
  });
  globalShortcut.register(shortcutPrefix + '2', function () {
      mainWindow.webContents.send('global-shortcut', 1);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (!configuration.readSettings('shortcutKeys')) {
    configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
  }
  createWindow();
  setGlobalShortcuts();
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('will-close', () => {
  globalShortcut.unregister('CommandOrControl+X');
  globalShortcut.unregisterAll();
})