'use strict';

var nconf = require('nconf').file({file: __dirname + '/sound-machine-config.json'});

function saveSettings(settingKey, settingValue){
  nconf.set(settingKey, settingValue);
  nconf.save();
}

function readSettings(settingKey) {
  nconf.load();
  return nconf.get(settingKey);
}

module.exports = {
  saveSettings: saveSettings,
  readSettings: readSettings
};