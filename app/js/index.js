'use strict';
const {ipcRenderer} = require('electron')
var soundButtons = document.querySelectorAll('.button-sound');

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
  ipcRenderer.send('close-main-window');
});

var settingsEl = document.querySelector('.settings');
settingsEl.addEventListener('click', function () {
  ipcRenderer.send('open-settings-window');
});

ipcRenderer.on('global-shortcut', function (event, index) {
  var event = new MouseEvent('click');
  soundButtons[index].dispatchEvent(event);
});

for (var i = 0; i < soundButtons.length; i++) {
    var soundButton = soundButtons[i];
    var soundName = soundButton.attributes['data-sound'].value;

    prepareButton(soundButton, soundName);
}

function prepareButton(buttonEl, soundName) {
    buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")';

    var audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
    buttonEl.addEventListener('click', function () {
        audio.currentTime = 0;
        audio.play();
    });
}