const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron');
const path = require('node:path')
let tray

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: '/pix/icon-512',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Remove the menu
  mainWindow.removeMenu();
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.on("close", (event) => {
    //mainWindow.close(); // so that we can close this window.
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('src/pix/icon-192.png');
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', type: 'normal', click: createWindow },
    { label: 'Quit', type: 'normal', click: handleQuit }
  ]);
  tray.setContextMenu(contextMenu);
  tray.addListener("click", () => createWindow());
  createWindow();
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Suppress for close to systray
    //app.quit();
  }
});

function handleQuit() {
  if (process.platform !== "darwin") {
    app.quit();
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.