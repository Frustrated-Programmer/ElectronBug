const electron = require('electron'), path = require('path'), url = require('url');
let ipcRenderer = electron.ipcRenderer;
let {app, BrowserWindow} = electron, mainWindow, modalWindow;

const createWindow = () => {
    let ratio = 16 / 9;
    let height = electron.screen.getPrimaryDisplay().workArea.height;
    let width = electron.screen.getPrimaryDisplay().workArea.width;
    if (width > height) height = width / ratio;
    else width = height / ratio;
    mainWindow = new BrowserWindow({
        fullscreen: false,
        width,
        height,
        frame: true,
        autoHideMenuBar: true,
        thickFrame: false,
        show: false,
        fullscreenable: false,
        maximizable: true,
        resizable:true,
        webPreferences: {
            nodeIntegration: true
        },
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './test.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.on('closed', () => app.quit());
    global.setGlobal = function (name, value) {
        global[name] = value;
    }
};




app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});
