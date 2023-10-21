const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require("node:fs");
function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
var fileData = {}
const documentsPath = app.getPath('documents');
const appFolderPath = `${documentsPath}\\` + app.getName();
const extensionFolderPath = appFolderPath + "\\Extensions";

function scanForProjects() {
  //creating all folders if they dont exsist
  if (fs.existsSync(extensionFolderPath + "\\indexed.json")) {
    fileData = JSON.parse(fs.readFileSync(extensionFolderPath + "\\indexed.json", { encoding: "utf8" }));
  } else {
    fs.writeFileSync(extensionFolderPath + "\\indexed.json", JSON.stringify({ "indexedExtensionsIds": [], "indexedExtensionsIds": [] }), { encoding: "utf8" })
    fileData = { "indexedExtensionsIds": [], "unindexedExtensionsIds": [] }
  }
  if (!fs.existsSync(appFolderPath)) {
    fs.mkdirSync(appFolderPath);
  }
  if (!fs.existsSync(extensionFolderPath)) {
    fs.mkdirSync(appFolderPath);
  }
  fs.readdir(extensionFolderPath, (err, files) => {
    if (err) {
      return;
    }
    const folders = files.filter(file => fs.statSync(`${extensionFolderPath}\\${file}`).isDirectory());
    folders.forEach(e => {
      const filePath = extensionFolderPath + "\\" + e + "\\ext.json"
      if (fs.existsSync(filePath)) {
        const extension = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
        extension["filePath"] = extensionFolderPath + "\\" + e+"\\main.js";
        extension["folderPath"] = extensionFolderPath + "\\" + e;
        if (fileData["indexedExtensionsIds"].includes(extension["id"])) {
        } else {
          if (extension["id"]) {
          } else {
            extension["id"] = guidGenerator()
            fileData["unindexedExtensionsIds"].push(extension["id"])
            fileData[extension["id"]] = extension

            fs.writeFileSync(filePath, JSON.stringify(extension), { encoding: "utf8" })
          }
        }
      }
    })
    fs.writeFileSync(extensionFolderPath + "\\indexed.json", JSON.stringify(fileData), { encoding: "utf8" })
  });
}
function startProcess(id){
  //spawn process
  console.log("Starting process with extension ID -", id)
  const main = require(fileData[id]["filePath"])
  main();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'app\\index.js')
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#212121',
      symbolColor: '#ffffff',
      height: 30
    },
    show: false
  })
  win.on("ready-to-show", () => {
    win.show()
    fileData["unindexedExtensionsIds"].forEach(e => {
      win.webContents.send('newExtension', fileData[e]);
    })

    fileData["indexedExtensionsIds"].forEach(e => {
      console.log(fileData[e].enabled);
      if(fileData[e].enabled){
        startProcess(e);
      }
      win.webContents.send('addedExtension', fileData[e]);
    })

    // Listen for messages from renderer process
    ipcMain.on('addExtension', (event, arg) => {
      console.log(arg); // prints "Hello from renderer"
      fileData[arg]["enabled"] = false;
      //removing from unindexed
      const indexToRemove = fileData["unindexedExtensionsIds"].indexOf(arg);
      if (indexToRemove !== -1) {
        fileData["unindexedExtensionsIds"].splice(arg, 1);
      }
      //adding to indexed
      fileData["indexedExtensionsIds"].push(arg)
      //writing to file
      fs.writeFileSync(extensionFolderPath + "\\indexed.json", JSON.stringify(fileData), { encoding: "utf8" })
    });

    ipcMain.on('enableExtension', (event, arg) => {
      fileData[arg]["enabled"] = true;
      fs.writeFileSync(extensionFolderPath + "\\indexed.json", JSON.stringify(fileData), { encoding: "utf8" })
      startProcess(arg);
    })
    ipcMain.on('disableExtension', (event, arg) => {
      fileData[arg]["enabled"] = false;
      fs.writeFileSync(extensionFolderPath + "\\indexed.json", JSON.stringify(fileData), { encoding: "utf8" })
    })

  })
  win.loadFile('app\\index.html')
}

app.whenReady().then(() => {
  createWindow()
  scanForProjects();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})