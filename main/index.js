const { app, BrowserWindow, ipcMain } = require('electron')
const prepareNext = require('electron-next')
const isDev = require('electron-is-dev')
const path = require('path')
const os = require('os')
const { KlipStore } = require('./klip-store')

let mainWindow
const store = new KlipStore({
  dir: path.join(os.tmpdir(), 'klipped'),
  defaultName: 'untitled.txt'
})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  const devPath = 'http://localhost:8000/start'
  const prodPath = path.resolve('renderer/out/start/index.html')
  const entry = isDev ? devPath : 'file://' + prodPath

  mainWindow.loadURL(entry)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', async () => {
  await store.init()
  await prepareNext('./renderer')
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('addfile', async (event, { name, data }) => {
  await store.addFile({ name, data })
})

ipcMain.on('removefile', async (event, id) => {
  await store.removeFile(id)
})

ipcMain.on('renamefile', async (event, {id, newName}) => {
  await store.renameFile({ id, newName })
})

ipcMain.on('clearfiles', async event => {
  await store.clear()
})
