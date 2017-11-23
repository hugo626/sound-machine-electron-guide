// Add your settings.js code in this file
'use strict';

const {
  ipcRenderer
} = require('electron');
const configuration = require('../configuration');
const modifierCheckboxes = document.querySelectorAll('.global-shortcut');

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function(e) {
  ipcRenderer.send('close-settings-window');
});

for (var i = 0; i < modifierCheckboxes.length; i++) {
  var shortcutKeys = configuration.readSettings('shortcutKeys');
  var modifierKey = modifierCheckboxes[i].attributes['data-modifier-key'].value;
  modifierCheckboxes[i].checked = shortcutKeys.indexOf(modifierKey) !== -1;

  // Binding of clicks comes here
  modifierCheckboxes[i].addEventListener('click', function(e) {
    bindModifierCheckboxes(e);
  });
}

function bindModifierCheckboxes(event) {
  var shortcutKeys = configuration.readSettings('shortcutKeys');
  var modifierKey = event.target.attributes['data-modifier-key'].value;

  if (shortcutKeys.indexOf(modifierKey) !== -1) {
    var shortcutKeyIndex = shortcutKeys.indexOf(modifierKey);
    shortcutKeys.splice(shortcutKeyIndex, 1);
  } else {
    shortcutKeys.push(modifierKey);
  }

  configuration.saveSettings('shortcutKeys', shortcutKeys);
  ipcRenderer.send('set-global-shortcuts');
}