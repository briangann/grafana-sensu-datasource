'use strict';

System.register(['./common'], function (_export, _context) {
  "use strict";

  var getResponseForTarget;


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

  return {
    setters: [function (_common) {
      getResponseForTarget = _common.getResponseForTarget;
    }],
    execute: function () {
      _export('getClientHistoryURIs', getClientHistoryURIs);
    }
  };
});
//# sourceMappingURL=clienthistory_functions.js.map
