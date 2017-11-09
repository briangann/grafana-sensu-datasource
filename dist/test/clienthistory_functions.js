'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClientHistoryURIs = undefined;

var _common = require('./common');

/**
 * [getClientHistoryURIs description]
 * @param  {[type]} clientNames [description]
 * @return {[type]}             [description]
 */
function getClientHistoryURIs(clientNames) {
  var URIs = [];
  var dimensionURI = '/clients';
  // look for clientName in dimensions
  if (clientNames.length) {
    for (var i = 0; i < clientNames.length; i++) {
      aClientName = clientNames[i];
      dimensionURI = '/clients/' + aClientName + '/history';
      URIs.push(dimensionURI);
    }
  }
  if (URIs.length === 0) {
    URIs.push(dimensionURI);
  }
  return URIs;
}

exports.getClientHistoryURIs = getClientHistoryURIs;
//# sourceMappingURL=clienthistory_functions.js.map
