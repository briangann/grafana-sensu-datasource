'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var _typeof;

  /**
   *
   */

  function getAggregateURIs(target, aggregateNames) {
    // https://sensuapp.org/docs/0.28/api/aggregates-api.html
    var URIs = [];
    var dimensionURI = '/aggregates';
    var anAggregateName = null;
    // name, name/clients, name/checks, name/results/severity
    if (aggregateNames.length) {
      for (var i = 0; i < aggregateNames.length; i++) {
        anAggregateName = aggregateNames[i];
        dimensionURI = '/aggregates/' + anAggregateName;
        switch (target.aggregateMode) {
          case 'checks':
            dimensionURI = '/aggregates/' + anAggregateName + '/checks';
            break;
          case 'clients':
            dimensionURI = '/aggregates/' + anAggregateName + '/clients';
            break;
          case 'list':
            dimensionURI = '/aggregates/' + anAggregateName;
            break;
          case 'results_critical':
            dimensionURI = '/aggregates/' + anAggregateName + '/results/critical';
            break;
          case 'results_ok':
            dimensionURI = '/aggregates/' + anAggregateName + '/results/ok';
            break;
          case 'results_unknown':
            dimensionURI = '/aggregates/' + anAggregateName + '/results/unknown';
            break;
          case 'results_warning':
            dimensionURI = '/aggregates/' + anAggregateName + '/results/warning';
            break;
        }
        URIs.push(dimensionURI);
      }
    }
    if (URIs.length === 0) {
      URIs.push(dimensionURI);
    }
    return URIs;
  }

  /**
   * [convertAggregatesToDataPoints description]
   * @param  {[type]} response [description]
   * @return {[type]}        [description]
   */
  function convertAggregatesToDataPoints(aTarget, responses) {
    var response = getResponseForTarget(aTarget, responses);
    // the result has no "datapoints", need to create it based on the check data

    // when we have a checkname and an clientName, the response is different, the
    // data is not an array, but contains the same information, recreate and push
    if (response.data.length === undefined) {
      var singleData = response.data;
      response.data = [];
      response.data.push(singleData);
    }
    // storage for new data series constructed by aggregate responses
    var newData = null;
    for (var i = 0; i < response.data.length; i++) {
      var anEvent = response.data[i];
      // checks is defined when the aggregate mode is either "Clients" or "List"
      if (anEvent.checks !== undefined) {
        // create a new block of datapoints for each aggregate result json entry
        //
        var checkType = _typeof(anEvent.checks);
        switch (checkType) {
          case 'number':
            // checksType is a number, which is an aggregate list response
            newData = convertEventDataToAggregateModeList(anEvent, newData);
            break;
          case 'object':
            // checkType is an object, which is an aggregate clients response
            newData = convertEventDataToAggregateModeClient(anEvent, newData);
            break;
        }
        continue;
      }
      // clients is defined when the aggregate mode is "Checks"
      if (anEvent.clients !== undefined) {
        newData = convertEventDataToAggregateModeChecks(anEvent, newData);
        continue;
      }
      // summary is defined when the aggregate mode is "Results OK/WARNING/CRITICAL/UNKNOWN"
      if (anEvent.summary !== undefined) {
        newData = convertEventDataToAggregateModeResults(anEvent, newData);
        continue;
      }

      // this is a simple aggregate response (no mode)
      var datapoints = [];
      // timestamp is the query now (just use now)
      var timestamp = Math.floor(Date.now());
      datapoints[0] = [0, timestamp];
      anEvent.datapoints = datapoints;
      // set the target to be the name of the aggregate
      anEvent.target = anEvent.name;
    }
    if (newData !== null) {
      // overwrite the old data field with the new expanded set
      response.data = newData;
    }
    return response;
  }

  function convertEventDataToAggregateModeResults(anEvent, dataSet) {
    var timestamp = Math.floor(Date.now());
    if (dataSet === null) {
      // initialize empty array
      dataSet = [];
    }
    // iterate over the checks
    for (var i = 0; i < anEvent.summary.length; i++) {
      var aSummary = anEvent.summary[i];
      var checkData = {
        target: anEvent.check,
        clients: aSummary.clients,
        datapoints: [[aSummary.total, timestamp]]
      };
      dataSet.push(checkData);
    }
    return dataSet;
  }
  // An aggregate checks result has the format
  // {
  //    clients: [
  //      clientName
  //    ],
  //    name: checkName
  // }
  function convertEventDataToAggregateModeChecks(anEvent, dataSet) {
    var timestamp = Math.floor(Date.now());
    if (dataSet === null) {
      // initialize empty array
      dataSet = [];
    }
    // iterate over the checks
    for (var i = 0; i < anEvent.clients.length; i++) {
      var clientName = anEvent.clients[i];
      var checkData = {
        target: anEvent.name,
        datapoints: [[clientName, timestamp]]
      };
      dataSet.push(checkData);
    }
    return dataSet;
  }

  // An aggregate clients result has the format
  // {
  //    checks: [
  //      checkName
  //    ],
  //    name: clientName
  // }
  function convertEventDataToAggregateModeClient(anEvent, dataSet) {
    var timestamp = Math.floor(Date.now());
    if (dataSet === null) {
      // initialize empty array
      dataSet = [];
    }
    // iterate over the checks
    for (var i = 0; i < anEvent.checks.length; i++) {
      var checkName = anEvent.checks[i];
      var clientData = {
        target: anEvent.name,
        datapoints: [[checkName, timestamp]]
      };
      dataSet.push(clientData);
    }
    return dataSet;
  }
  // An aggregate list result has the format
  // {
  //   checks: int,
  //   clients: int,
  //   results: {
  //    critical: int,
  //    ok: int,
  //    stale: int,
  //    total: int,
  //    unknown: int,
  //    warning: int
  //   }
  // }
  function convertEventDataToAggregateModeList(anEvent, dataSet) {
    if (dataSet === null) {
      // initialize empty array
      dataSet = [];
    }
    var timestamp = Math.floor(Date.now());
    var item = {
      target: 'checks',
      datapoints: [[anEvent.checks, timestamp]]
    };
    dataSet.push(item);
    item = {
      target: 'clients',
      datapoints: [[anEvent.clients, timestamp]]
    };
    dataSet.push(item);
    item = {
      target: 'critical',
      datapoints: [[anEvent.results.critical, timestamp]]
    };
    dataSet.push(item);
    item = {
      target: 'ok',
      datapoints: [[anEvent.results.ok, timestamp]]
    };
    dataSet.push(item);
    item = {
      target: 'stale',
      datapoints: [[anEvent.results.stale, timestamp]]
    };
    dataSet.push(item);
    item = {
      target: 'total',
      datapoints: [[anEvent.results.total, timestamp]]
    };
    dataSet.push(item);
    item = {
      target: 'unknown',
      datapoints: [[anEvent.results.unknown, timestamp]]
    };
    dataSet.push(item);
    item = {
      target: 'warning',
      datapoints: [[anEvent.results.warning, timestamp]]
    };
    dataSet.push(item);

    return dataSet;
  }

  function convertToAggregateModeClientJSON(data, dataSet) {
    //debugger;
    var timestamp = Math.floor(Date.now());
    if (dataSet === null) {
      // initialize empty array
      dataSet = [];
    }
    // iterate over the checks
    for (var i = 0; i < data.checks.length; i++) {
      var checkName = data.checks[i];
      var clientData = {
        target: data.name,
        datapoints: [[checkName, timestamp]]
      };
      dataSet.push(clientData);
    }
    return dataSet;
  }

  /**
   * [convertAggregatesToJSON description]
   * @param  {[type]} response [description]
   * @param  {[type]} aTarget  [description]
   * @return {[type]}          [description]
   */
  function convertAggregatesToJSON(aTarget, responses) {
    var response = getResponseForTarget(aTarget, responses);
    var aggregateName = "ALL";
    if (aTarget.dimensions.length > 0) {
      aggregateName = aTarget.dimensions[0].value;
    }
    for (var i = 0; i < response.data.length; i++) {
      var item = response.data[i];
      var datapoints = [];
      var data = {
        client: item.name,
        checks: item.checks,
        aggregate_name: aggregateName
      };
      datapoints.push(data);
      item.datapoints = datapoints;
      item.type = 'docs';
    }
    return response;
  }

  return {
    setters: [],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      _export('getAggregateURIs', getAggregateURIs);

      _export('convertAggregatesToDataPoints', convertAggregatesToDataPoints);

      _export('convertAggregatesToJSON', convertAggregatesToJSON);
    }
  };
});
//# sourceMappingURL=aggregate_functions.js.map
