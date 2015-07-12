var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

var program = require("commander")
  .option("-d, --dev-tools", "Open Dev Tools on start up")
  .parse(process.argv)

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 400, height: 550,
    //"min-width": 400, "max-width": 400, "min-height": 550, "max-height":550
   });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/dist/index.html');

  // Open the devtools.
  program.devTools && mainWindow.openDevTools({detached:true});

  // Emitted when the window is closed.
  mainWindow.on('closed', function(){
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
});