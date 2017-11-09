import { getResponseForTarget } from './common';

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
    for (let i = 0; i < clientNames.length; i++) {
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

export {
  getClientHistoryURIs
};
