let dialog_class = require('./dialog.js');
let dialog;
let response = document.getElementById('response')
document.getElementById('open').onclick = function () {
    console.log('Showing Dialog');
    dialog = new dialog_class("./example_dialog/confirm.html");
    dialog.displayCenter();
    dialog.display().then(function (value) {
        response.innerText = value;
        dialog = null;
    });

}
