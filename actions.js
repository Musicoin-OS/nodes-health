var fs = require('fs-extra');
var jayson = require('jayson');
var _ = require('lodash');
var portscanner = require('portscanner');
var ipRegex = require('ip-port-regex');
module.exports = {
  activePeers: function() {
    var pathOfNodes = '/var/www/nodes-health/files/bootnodes-not-filtered.json';
    var bootnodes = JSON.parse(fs.readFileSync(pathOfNodes, 'utf-8'));
    var client = jayson.client.http('http://localhost:8545');
    client.request('admin_peers', [], function(err, response) {
    //console.log(response);
      if(err) throw err;
    var aPeers = JSON.parse(JSON.stringify(response.result));
    for(var i = 0; i < aPeers.length; i++) {
    module.exports.addOrRemove(bootnodes.nodes, "enode://" + aPeers[i].id + "@" + aPeers[i].network.remoteAddress);
    fs.writeFileSync(pathOfNodes, JSON.stringify(bootnodes, null, 4), 'utf-8');
    }
    });
  },
  addOrRemove: function(arr, val) {
    if (!_.includes(arr, val)) {
    arr.unshift(val);
    } else {
    _.union(arr, [val]);
    }
  },
  rxArray: function() {
    var pathOfNodes = '/var/www/nodes-health/files/bootnodes-not-filtered.json';
    var aPeers = JSON.parse(fs.readFileSync(pathOfNodes, 'utf-8'));
    aPeers.nodes = String(aPeers.nodes).match(/(?<=@)[0-9.:]*/g);
    module.exports.ipAndPortFilter(aPeers.nodes);
  },
  ipAndPortFilter: function(aPeers) {
    var nodesIpPort = '/var/www/nodes-health/files/bootnodes-ip-and-port.json';
    fs.removeSync(nodesIpPort);
    ipAndPort = aPeers.map( data => ipRegex.parts(data));
    //console.log(ipAndPort);
    fs.writeFileSync(nodesIpPort, JSON.stringify(ipAndPort, null, 2), 'utf-8');
    module.exports.portScan();
  },
  portScan: function() {
    var nodesIpPort = '/var/www/nodes-health/files/bootnodes-ip-and-port.json';
    var openArr = '/var/www/nodes-health/files/bootnodes-opened.json';
    var closedArr = '/var/www/nodes-health/files/bootnodes-closed.json';
    var ipAndPort = [];
    fs.removeSync(openArr);
    fs.removeSync(closedArr);
    fs.writeFileSync(openArr, JSON.stringify(ipAndPort, null, 2), 'utf-8');
    fs.writeFileSync(closedArr, JSON.stringify(ipAndPort, null, 2), 'utf-8');
    ipAndPort = JSON.parse(fs.readFileSync(nodesIpPort, 'utf-8'));
    for(var i = 0; i < ipAndPort.length; i++) {
      portscanner.checkPortStatus(ipAndPort[i].port, ipAndPort[i].ip, function(error, status) {
        //console.log(status);
      });
    }
  },
  finalBootNodes: function() {
    var pathOfNodes = '/var/www/nodes-health/files/bootnodes-not-filtered.json';
    var finalNodes = '/var/www/nodes-health/www/music-bootnodes/bootnodes.json';
    var openArr = '/var/www/nodes-health/files/bootnodes-opened.json';
    fs.removeSync(finalNodes);
    var openNodes = JSON.parse(fs.readFileSync(openArr, 'utf-8'));
    var bootnodes = JSON.parse(fs.readFileSync(pathOfNodes, 'utf-8'));
    bootnodes.nodes = bootnodes.nodes.filter(function(e) {
        return openNodes.some(function (f) {
            return e.includes(f) 
        });
    });
    fs.writeFileSync(finalNodes, JSON.stringify(bootnodes, null, 4), 'utf-8');
  }
};
