const electron = require('electron'), path = require('path'), url = require('url');

class dialog {
    constructor(dir, args) {
        this.window = null;
        this.show = null;
        this.closePreviousDialog = true;
        this.dir = dir;
        this._displayingCenter = false;
        this._cancelCloseEvent = false;
        args = args || {};
        this.window = new electron.remote.BrowserWindow({
            fullscreen: args.fullscreen || false,
            width: args.width || electron.remote.getCurrentWindow().getSize()[0],
            height: args.height || electron.remote.getCurrentWindow().getSize()[1],
            center: args.center || true,
            closable: args.closable || false,
            minimizable: args.minimizable || true,
            maximizable: args.maximizable || false,
            frame: args.frame || false,
            transparent: args.transparent || true,
            autoHideMenuBar: args.autoHideMenuBar || true,
            thickFrame: args.thickFrame || false,
            parent: args.parent || electron.remote.getCurrentWindow(),
            modal: args.modal || true,
            resizable: args.resizable || false,
            movable: args.movable || false,
            show: args.show || false,
            fullscreenable: args.fullscreenable || false,
            webPreferences: {
                nodeIntegration: true
                //			devTools: false
            },
            icon: path.join(__dirname, `./../images/icon.ico`)
        });
    }

    halfParentSize() {
        let parentsSize = this.window.getParentWindow().getSize();
        this.setSize(parentsSize[0] / 2, parentsSize[1] / 2)
    }

    displayCenter() {
        if (this.width === undefined || this.height === undefined) this.halfParentSize();
        this._displayingCenter = true;
        let parentsSize = this.window.getParentWindow().getSize();
        let parentsPos = this.window.getParentWindow().getPosition();
        this.x = (parentsSize[0] - this.width) / 2;
        this.y = (parentsSize[1] - this.height) / 2;
        this.x += parentsPos[0];
        this.y += parentsPos[1];
        this.window.setPosition(Math.round(this.x), Math.round(this.y));
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.window.setSize(Math.floor(width), Math.floor(height));
        if (this._displayingCenter) this.displayCenter();
    }

    setPosition(x, y) {
        this._displayingCenter = false;
        this.x = x;
        this.y = y;
        this.window.setPosition(Math.round(this.x), Math.round(this.y));
    }

    destroy() {
        console.log(JSON.parse(JSON.stringify(this.window)));
        if(this.window && this.window.isClosable && this.window.isClosable())this.window.close();
        else this.window.destroy();
    }

    display(context) {
        return new Promise((cb) => {
            electron.ipcRenderer.on("callback", (event,val) => {
                this._cancelCloseEvent = true;
                this.destroy();
                cb(val);
            });
            this.window.loadURL(url.format({
                pathname: path.join(__dirname, this.dir),
                protocol: 'file:',
                slashes: true
            })).then(() => {
                    if (this.closePreviousDialog && false) {
                        let children = this.window.getParentWindow().getChildWindows();
                        for (let i = 0; i < children.length; i++) {
                            children[i].destroy();
                        }
                    }
                    if (context) {
                        this.window.webContents.send('store-data', context);
                    }
                    if (typeof this.onShow === "function") {
                        this.window.once(`show`, () => {
                            this.onShow();
                        });
                    }
                    this.window.show();
                });
            this.window.on(`close`, () => {
                if (!this._cancelCloseEvent) cb(false);
            });

        });
    }
}

module.exports = dialog;
