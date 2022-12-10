// TODO: make the menu-bar icon small

require('v8-compile-cache');

const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron')

let tray = null

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        show: true,  // Hide the window when it is created
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        preloadWindow: true,
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Create a tray icon for the app
    // Create a tray icon for the app
    const iconPath = 'app-icon.png'
    const icon = nativeImage.createFromPath(iconPath)
    icon.setTemplateImage(true)  // Make the icon small and native-looking
    tray = new Tray(icon)
    // tray = new Tray('app-icon.png')
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => win.show() },  // Show the window when the tray icon is clicked
        { label: 'Quit', click: () => app.quit() }
    ])
    tray.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
