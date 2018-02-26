var actions = require('./actions');
var twoMinutes = 120000;
var fifteenMinutes = 900000;

  setInterval(function() {
    actions.activePeers();
  }, twoMinutes);
    setInterval(function() {
    actions.rxArray(actions.finalBootNodes());
  }, fifteenMinutes);
