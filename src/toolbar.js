import BrowserWindow from 'sketch-module-web-view';
import { getWebview } from 'sketch-module-web-view/remote';
import UI from 'sketch/ui';

//import commands
import setupComments from './setup';
import createComment from './actions/create-comment';
import editComment from './actions/edit-comment';
import deleteComment from './actions/delete-comment';
import hideComments from './actions/toggle-comments';
import removeCommments from './actions/remove-comments';

const webviewIdentifier = 'sketch-notes.webview';

export default function () {
  const options = {
    x: 250,
    y: 120,
    width: 255,
    height: 60,
    identifier: webviewIdentifier,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    // frame: false,
    titleBarStyle: 'default'
  };

  const browserWindow = new BrowserWindow(options);

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();
  });

  const webContents = browserWindow.webContents;

  // print a message when the page loads
  // webContents.on('did-finish-load', () => {
  //   UI.message('UI loaded!')
  // })

  // add a handler for a call from web content's javascript
  // webContents.on('nativeLog', s => {
  //   UI.message(s)
  //   webContents
  //     .executeJavaScript(`setRandomNumber(${Math.random()})`)
  //     .catch(console.error)
  // })

  webContents.on('setup', s => setupComments());
  webContents.on('create', s => createComment());
  webContents.on('edit', s => editComment());
  webContents.on('delete', s => deleteComment());
  webContents.on('hide', s => hideComments());
  webContents.on('remove', s => removeCommments());
  webContents.on('close', s => {
    browserWindow.close();
  });

  browserWindow.loadURL(require('../resources/webview.html'));
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}