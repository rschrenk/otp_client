const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

createWindow = function(){
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 700,
    icon: '/pix/icon-512',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 500,
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Remove the menu
  mainWindow.removeMenu();
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.on("close", (event) => {
    mainWindow.hide();
  });
  mainWindow.on("minimize", (event) => {
    mainWindow.hide();
  });
  mainWindow.setAlwaysOnTop(true, "normal");
  mainWindow.setClosable(false);
  mainWindow.setFullScreenable(false);
  mainWindow.setResizable(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  const icon = nativeImage.createFromPath('src/pix/icon-192.png');
  const tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', type: 'normal', click: createWindow },
    { label: 'Quit', type: 'normal', click: function(){
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Suppress for close to systray
    app.quit();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.