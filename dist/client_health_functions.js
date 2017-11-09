'use strict';

System.register(['./common'], function (_export, _context) {
  "use strict";

  var getResponseForTarget;


  /**
   * [getClientHealthURIs description]
   * @param  {[type]} clientNames [description]
   * @return {[type]}             [description]
   */
  function getClientHealthURIs(clientNames) {
    var URIs = [];
    // look for clientName in dimensions
    if (clientNames.length) {
      for (var i = 0; i < clientNames.length; i++) {
        var aClientName = clientNames[i];
        var resultsURI = '/results/' + aClientName;
        URIs.push(resultsURI);
        var eventsURI = '/events/' + aClientName;
        URIs.push(eventsURI);
      }
    }
    if (URIs.length === 0) {
      URIs.push('/results');
      URIs.push('/events');
    }
    return URIs;
  }

  /**
   * [convertClientHealthToJSON description]
   * @param  {[type]} target   [description]
   * @param  {[type]} response [description]
   * @return {[type]}          [description]
   */
  /*
    Client Health
  
    Health is determined by taking the worst of the non-silenced results for a client
  
    The "unknown" state can optionally be used as the worst state
    Specifically:
      /results/:client
          status field is inspected for:
          0 = OK
          1 = WARNING
          2 = CRITICAL
          3 = UNKNOWN
      /events/:client
          status field is inspected
  
   */
  function convertClientHealthToJSON(aTarget, responses) {
    var response = getResponseForTarget(aTarget, responses);

    var filteredData = [];
    //debugger;
    for (var i = 0; i < response.data.length; i++) {
      var anEvent = response.data[i];
      var datapoints = [];
      //console.log(JSON.stringify(anEvent));
      if (anEvent.check.issued !== undefined) {
        var data = {
          timestamp: anEvent.check.issued * 1000,
          check_name: anEvent.check.name,
          client: anEvent.client,
          check: anEvent.check,
          occurrences: anEvent.occurrences,
          occurrences_watermark: anEvent.occurrences_watermark,
          action: anEvent.action,
          id: anEvent.id,
          last_state_change: anEvent.last_state_change * 1000,
          last_ok: anEvent.last_ok * 1000,
          silenced: anEvent.silenced,
          silenced_by: anEvent.silenced_by
        };
        try {
          data.check.issued = data.check.issued * 1000;
          data.check.executed = data.check.executed * 1000;
        } catch (err) {
          // do nothing
        }
        datapoints.push(data);
        anEvent.datapoints = datapoints;
        delete anEvent.check;
        delete anEvent.client;
        anEvent.type = 'docs';
        if (!anEvent.silenced) {
          filteredData.push(anEvent);
        }
        if (anEvent.silenced && !aTarget.hideSilencedEvents) {
          filteredData.push(anEvent);
        }
      }
    }
    response.data = filteredData;
    //var str = JSON.stringify(response, null, 2);
    //console.log(str);
    return response;
  }

  // TODO
  //  This needs to return health of individual clients
  function convertClientHealthMetricsToJSON(aTarget, responses) {
    var response = getResponseForTarget(aTarget, responses);
  }return {
    setters: [function (_common) {
      getResponseForTarget = _common.getResponseForTarget;
    }],
    execute: function () {
      _export('getClientHealthURIs', getClientHealthURIs);

      _export('convertClientHealthToJSON', convertClientHealthToJSON);

      _export('convertClientHealthMetricsToJSON', convertClientHealthMetricsToJSON);
    }
  };
});
//# sourceMappingURL=client_health_functions.js.map
