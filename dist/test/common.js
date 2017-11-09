'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getResponseForTarget(aTarget, responses) {
  /*jshint -W087 */
  //debugger;
  // find a response that matches the target
  var response = {
    data: []
  };
  for (var i = 0; i < responses.data.length; i++) {
    if (responses.data[i].target === aTarget) {
      // this is the response to convert
      response.data = responses.data[i].response.data;
      break;
    }
  }
  return response;
}

function getClientsWithFilter(aTarget, response) {
  var arrClientNames = [];
  for (var i = 0; i < aTarget.filters.length; i++) {
    var aFilter = aTarget.filters[i];
    switch (aFilter.filterType) {
      case 'field':
        for (var j = 0; j < response.data.length; j++) {
          if (response.data[j].hasOwnProperty(aFilter.filterFieldName)) {
            var fieldVal = response.data[j][aFilter.filterFieldName];
            if (fieldVal === aFilter.filterFieldValueReplaced) {
              // matched field
              if (arrClientNames.indexOf(response.data[j].name) === -1) {
                arrClientNames.push(response.data[j].name);
              }
            }
          }
        }
        break;
      case 'fetch':
        // iterate over all of the data
        for (var _j = 0; _j < response.data.length; _j++) {
          if (aFilter.value === response.data[_j].name) {
            // add to list of tracked names
            if (arrClientNames.indexOf(response.data[_j].name) === -1) {
              arrClientNames.push(response.data[_j].name);
            }
          }
        }
        break;
      case 'regex':
        // make sure the regex is valid
        try {
          var flags = aFilter.filterRegexFlags;
          var re = new RegExp(aFilter.filterRegex, flags);
          // iterate over all of the data
          for (var _j2 = 0; _j2 < response.data.length; _j2++) {
            if (re.test(response.data[_j2].name)) {
              // add to list of tracked names
              if (arrClientNames.indexOf(response.data[_j2].name) === -1) {
                arrClientNames.push(response.data[_j2].name);
              }
            }
          }
        } catch (err) {
          aFilter.filterMessage = 'Invalid Regular Expression';
        }
        break;
    }
  }
  return arrClientNames;
}

exports.getResponseForTarget = getResponseForTarget;
exports.getClientsWithFilter = getClientsWithFilter;
//# sourceMappingURL=common.js.map
