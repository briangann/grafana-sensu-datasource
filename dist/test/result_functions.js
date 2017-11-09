'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertResultsToJSON = exports.convertResultsToDataPoints = exports.convertResultsToTable = exports.getResultURIs = undefined;

var _common = require('./common');

function getResultURIs(checkNames, clientNames) {
  var URIs = [];
  var dimensionURI = '/results';
  var aClientName = null;
  var aCheckName = null;
  var anAggregateName = null;
  if (clientNames.length) {
    for (var i = 0; i < clientNames.length; i++) {
      aClientName = clientNames[i];
      dimensionURI = '/results/' + aClientName;
      URIs.push(dimensionURI);
    }
  }
  if (checkNames.length && clientNames.length) {
    for (var _i = 0; _i < clientNames.length; _i++) {
      aClientName = clientNames[_i];
      for (var j = 0; j < checkNames.length; j++) {
        aCheckName = checkNames[_i];
        dimensionURI = '/results/' + aClientName + '/' + aCheckName;
        URIs.push(dimensionURI);
      }
    }
  }
  if (URIs.length === 0) {
    URIs.push(dimensionURI);
  }
  return URIs;
}

function convertResultsToTable(aTarget, responses) {
  var response = (0, _common.getResponseForTarget)(aTarget, responses);

  // the result has no "datapoints", need to create it based on the check data
  // when we have a checkname and a clientName, the response is different, the
  // data is not an array, but contains the same information, recreate and push
  if (response.data.length === undefined) {
    var singleData = response.data;
    response.data = [];
    response.data.push(singleData);
  }
  // this will be collapsed into table format, where the columns are predefined
  // and each row is a response formatted to the columns
  var rowData = [];
  for (var i = 0; i < response.data.length; i++) {
    var rowInfo = response.data[i];
    var aRow = [rowInfo.check.issued * 1000, rowInfo.client, rowInfo.check.name, rowInfo.check.status, rowInfo.check.issued * 1000, rowInfo.check.executed * 1000, rowInfo.check.output, rowInfo.check.type, rowInfo.check.thresholds.warning, rowInfo.check.thresholds.critical];
    // now push into rowData
    rowData.push(aRow);
  }
  // collapse everything into data[0]
  var anEvent = response.data[0];
  var datapoints = [];
  datapoints[0] = [anEvent.check.status, anEvent.check.issued * 1000];
  anEvent.datapoints = datapoints;
  anEvent.type = "table";
  anEvent.columns = [{ text: 'Time', type: 'date' }, { text: 'client' }, { text: 'check.name' }, { text: 'check.status' }, { text: 'check.issued', type: 'date' }, { text: 'check.executed', type: 'date' }, { text: 'check.output' }, { text: 'check.type' }, { text: 'check.thresholds.warning' }, { text: 'check.thresholds.critical' }];
  anEvent.rows = rowData;
  // truncate the rest
  response.data = [anEvent];
  //var str = JSON.stringify(response, null, 2);
  //console.log(str);
  return response;
}

/*
Response come back as:
{
"client": "p3-graphite-t1",
"check": {
  "thresholds": {
    "warning": 120,
    "critical": 180
  },
  "name": "keepalive",
  "issued": 1482067284,
  "executed": 1482067284,
  "output": "Keepalive sent from client 3 seconds ago",
  "status": 0,
  "type": "standard"
}
}
 */
function convertResultsToJSON(aTarget, responses) {
  var response = (0, _common.getResponseForTarget)(aTarget, responses);

  for (var i = 0; i < response.data.length; i++) {
    var anEvent = response.data[i];
    var datapoints = [];
    if (anEvent.check.issued !== undefined) {
      var data = {
        timestamp: anEvent.check.issued * 1000,
        message: anEvent.check.name,
        client: anEvent.client,
        check: {
          name: anEvent.check.name,
          issued: anEvent.check.issued * 1000,
          executed: anEvent.check.executed * 1000,
          output: anEvent.check.output,
          status: anEvent.check.status,
          type: anEvent.check.type
        }
      };
      datapoints.push(data);
      anEvent.datapoints = datapoints;
      delete anEvent.check;
      delete anEvent.client;
      anEvent.type = 'docs';
    }
  }
  //var str = JSON.stringify(response, null, 2);
  //console.log(str);
  return response;
}

/**
 * [convertResultsToDataPoints description]
 * @param  {[type]} response [description]
 * @return {[type]}        [description]
 */
function convertResultsToDataPoints(aTarget, responses) {
  var response = (0, _common.getResponseForTarget)(aTarget, responses);

  // the result has no "datapoints", need to create it based on the check data
  // when we have a checkname and an clientName, the response is different, the
  // data is not an array, but contains the same information, recreate and push
  if (response.data.length === undefined) {
    var singleData = response.data;
    response.data = [];
    response.data.push(singleData);
  }
  for (var i = 0; i < response.data.length; i++) {
    var anEvent = response.data[i];
    //var str = JSON.stringify(anEvent, null, 2);
    //console.log(str);
    var datapoints = [];
    if (anEvent.check.issued !== undefined) {
      datapoints[0] = [anEvent.check.status, anEvent.check.issued * 1000];
      // the duration is here...
      // datapoints[0] = [anEvent.check.duration, (anEvent.check.issued * 1000)];
    }
    anEvent.datapoints = datapoints;
    // set the target to be the check name
    if (anEvent.check.name !== undefined) {
      anEvent.target = anEvent.check.name;
    } else {
      anEvent.target = anEvent.check;
    }
  }
  return response;
}

exports.getResultURIs = getResultURIs;
exports.convertResultsToTable = convertResultsToTable;
exports.convertResultsToDataPoints = convertResultsToDataPoints;
exports.convertResultsToJSON = convertResultsToJSON;
//# sourceMappingURL=result_functions.js.map
