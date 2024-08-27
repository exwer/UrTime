import { join } from 'node:path'
import process from 'node:process'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { JSONFilePreset } from 'lowdb/node'
import icon from '../../resources/icon.png'

interface Data {
  tasks?: Task[]
}

// 初始化ipc通信
async function initIPC() {
  // 使用 JSON 文件适配器
  const defaultData = {
    tasks: [],
  }
  const db = await JSONFilePreset<Data>('userData.json', defaultData)

  const fns = {
    'get-tasks': async () => {
      await db.read()
      return db.data?.tasks || []
    },
    'add-task': async (_: unknown, task: Task) => {
      try {
        await db.read()
        db.data?.tasks?.push(task)
        await db.write()
      }
      catch (e) {
        console.error(e)
      }
    },
    'edit-task': async (_: unknown, index: number, updatedTask: Task) => {
      await db.read()
      if (db.data?.tasks && index >= 0 && index < db.data.tasks.length) {
        db.data.tasks[index] = updatedTask
        await db.write()
        return updatedTask
      }
      console.error('编辑失败，任务不存在')
    },
    'remove-task': async (_: unknown, index: number) => {
      await db.read()
      if (db.data?.tasks && index >= 0 && index < db.data.tasks.length) {
        const removedTask = db.data.tasks.splice(index, 1)
        await db.write()
        console.log('移除成功：', removedTask)
      }
      console.error('删除失败，任务不存在')
    },
  }
  for (const [name, fn] of Object.entries(fns)) {
    ipcMain.handle(name, fn)
  }
}

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  initIPC()

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
