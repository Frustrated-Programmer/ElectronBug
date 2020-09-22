let electron = require('electron');
let ipcRenderer = electron.ipcRenderer;
let callback = function (value) {
    electron.remote.getCurrentWindow().getParentWindow().webContents.send('callback',value);
};
let confirm = document.getElementById("continue");
let deny = document.getElementById("cancel");
let text = document.getElementById("txt");
ipcRenderer.on('store-data', function (event, context) {
    if(typeof context === "object"){
        if(typeof context.confirm === "string") confirm.innerHTML = context.confirm;
        if(typeof context.deny === "string") deny.innerHTML = context.deny;
        if(typeof context.text === "string") text.innerHTML = context.text;
        if(typeof context.title === "string") document.getElementById('title').innerHTML = context.title;
    }
    else if(typeof context === "string"){
        text.innerHTML = context;
    }
});
confirm.onclick = function () {
    callback(true);
};
deny.onclick = function () {
    callback(false);
};
