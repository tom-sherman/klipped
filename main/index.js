const { app, BrowserWindow, ipcMain } = require('electron')
const prepareNext = require('electron-next')
const isDev = require('electron-is-dev')
const path = require('path')
const os = require('os')
const { KlipStore } = require('./klip-store')

let mainWindow
global.DEFAULT_FILE_NAME = 'untitled.txt'

const store = new KlipStore({
  dir: path.join(os.tmpdir(), 'klipped'),
  defaultName: global.DEFAULT_FILE_NAME
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

ipcMain.on('add-file', async (event, { name, data }) => {
  try {
    const file = await store.addFile({ name, data })
    event.sender.send('file-created', {
      name: file.name,
      data: file.data,
      id: file.id,
      path: file.path
    })
  } catch (err) {
    event.sender.send('error', err)
  }
})

ipcMain.on('remove-file', async (event, id) => {
  await store.removeFile(id)
})

ipcMain.on('rename-file', async (event, {id, newName}) => {
  await store.renameFile({ id, newName })
})

ipcMain.on('clear-files', async event => {
  await store.clear()
})

ipcMain.on('drag-file', async (event, file) => {
  // TODO: Generate dragicon using file name.
  const icon = path.join(__dirname, '..', 'static', 'dragicon.png')
  event.sender.startDrag({ file, icon  })
})

ipcMain.on('list-files', event => {
  event.sender.send('file-list', store.serialize())
})
