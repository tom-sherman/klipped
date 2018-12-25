const { app, BrowserWindow, ipcMain } = require('electron')
const prepareNext = require('electron-next')
const isDev = require('electron-is-dev')
const path = require('path')
const { saveTempFile, renameTempFile } = require('./temp-file')

let mainWindow

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

ipcMain.on('data', async (event, {data, name}) => {
  let filePath

  try {
    filePath = await saveTempFile({data, name})
  } catch (err) {
    console.error(err)
    event.sender.send('error', err)
    return
  }

  event.sender.send('file', filePath)
})

ipcMain.on('rename', async (event, { currentName, newName }) => {
  let newPath

  try {
    newPath = await renameTempFile({ currentName, newName })
  } catch (err) {
    console.error(err)
    event.sender.send('error', err)
    return
  }

  event.sender.send('renamed', newPath)
})

ipcMain.on('ondragstart', (event, file) => {
  // TODO: Generate dragicon using file name.
  const icon = path.join(__dirname, '..', 'static', 'dragicon.png')
  event.sender.startDrag({ file, icon  })
})
