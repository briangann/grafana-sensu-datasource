import angular from "angular";
import _ from "lodash";
import dateMath from "app/core/utils/datemath";
import kbn from "app/core/utils/kbn";
import {
  convertClientsToJSON,
  convertClientHistoryToDataPoints,
  convertClientsToDataPoints,
  convertClientSummaryMetricsToJSON,
  getClientsURIs
} from './client_functions';
import {
  convertEventsToJSON,
  convertEventsToDataPoints,
  convertEventsToEventMetrics,
  convertEventsToEventMetricsJSON,
  getEventsURIs
} from './event_functions';
import {
  getAggregateURIs,
  convertAggregatesToDataPoints,
  convertAggregatesToJSON
} from './aggregate_functions';
import {
  getResultURIs,
  convertResultsToTable,
  convertResultsToDataPoints,
  convertResultsToJSON
} from './result_functions';
import {
  getClientHistoryURIs
} from './clienthistory_functions';
import {
  getClientHealthURIs,
  convertClientHealthToJSON,
  convertClientHealthMetricsToJSON
} from './client_health_functions';

export class SensuDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv, uiSegmentSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.basicAuth = instanceSettings.basicAuth;
    this.withCredentials = instanceSettings.withCredentials;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.uiSegmentSrv = uiSegmentSrv;
    //this.clientQueryTags = [];
  }

  // Required for templating
  // gets the clients from Sensu API
  // https://sensuapp.org/docs/0.26/api/clients-api.html

  /**
   * [metricFindQuery description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  metricFindQuery(options) {
    //console.log("metricFindQuery entered: " + options);
    var isClientTags = false;
    var isClientTagValue = false;
    var aQuery = "/clients";
    var tagToValue = "";
    // substitute template vars
    options = this.templateSrv.replaceWithText(options);
    if ((options !== undefined) && (options !== "")) {
      switch (true) {
        case /clienttags/.test(options):
          aQuery = '/clients';
          isClientTags = true;
          break;
        case /clienttagvalue/.test(options):
          aQuery = '/clients';
          isClientTagValue = true;
          // split out the tag from the query
          tagToValue = options.split("tag=")[1];
          break;
        default:
          aQuery = options;
      }
      // make sure there is a leading slash
      if (!aQuery.startsWith("/")) {
        aQuery = "/" + aQuery;
      }
    }
    var _this = this;
    return this.backendSrv.datasourceRequest({
      url: this.url + aQuery,
      data: options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": this.basicAuth
      }
    }).then(function(response) {
      //_this.clientQueryTags = _this.generateClientQueryTags(response);
      if (isClientTags) {
        return _this.generateClientQueryTags(response);
      }
      if (isClientTagValue) {
        return _this.getClientQueryTagValue(response, tagToValue);
      }
      return _this.mapToClientNameAndVersion(response);
    });
  }

  generateClientQueryTags(response) {
    var clientQueryTags = [];
    var allTags = [];
    var excludedTags = [
      'name',
      'socket',
      'address',
      'subscriptions',
      'timestamp',
      'keepalive',
      'keepalives',
      'redact',
      'version'
    ];
    for (let i = 0; i < response.data.length; i++) {
      var keys = Object.keys(response.data[i]);
      for (let j = 0; j < keys.length; j++) {
        let keyName = keys[j];
        if (excludedTags.indexOf(keyName) === -1) {
          let tagValue = response.data[i][keyName];
          let fullKeyName = keyName + "=" + tagValue;
          if (allTags.indexOf(fullKeyName) < 0) {
            allTags.push(fullKeyName);
          }
        }
      }
    }
    if (allTags.length > 0) {
      // build the tags
      allTags.sort();
      for (let i = 0; i < allTags.length; i++) {
        clientQueryTags.push(
          {
            text: allTags[i],
            expandable: true
          }
        );
      }
    }
    return clientQueryTags;
  }

  getClientQueryTagValue(response, tag) {
    var tagSplit = tag.split('=');
    var tagToMatch = tagSplit[0];
    var tagValueToMatch = tagSplit[1];
    var clientQueryTags = [];
    var allTagValues = [];
    for (let i = 0; i < response.data.length; i++) {
      var keys = Object.keys(response.data[i]);
      for (let j = 0; j < keys.length; j++) {
        let keyName = keys[j];
        if (tagToMatch === keyName) {

          // this can be a value or an array inside, check both
          if (typeof response.data[i][tagToMatch] !== 'string') {
            for (let z = 0; z < response.data[i][tagToMatch].length; z++) {
              if (response.data[i][tagToMatch][z] === tagValueToMatch) {
                //let tagValue = response.data[i][keyName];
                let tagValue = response.data[i].name;
                if (allTagValues.indexOf(tagValue) < 0) {
                  allTagValues.push(tagValue);
                }
              }
            }
          } else {
            if (response.data[i][tagToMatch] === tagValueToMatch) {
              //let tagValue = response.data[i][keyName];
              let tagValue = response.data[i].name;
              if (allTagValues.indexOf(tagValue) < 0) {
                allTagValues.push(tagValue);
              }
            }
          }
        }
      }
    }
    if (allTagValues.length > 0) {
      // build the tags
      for (let i = 0; i < allTagValues.length; i++) {
        clientQueryTags.push(
          {
            text: allTagValues[i]
          }
        );
      }
    }
    return clientQueryTags;
  }

  /**
   * [mapToClientNameAndVersion description]
   * @param  {[type]} result [description]
   * @return {[type]}        [description]
   */
  mapToClientNameAndVersion(result) {
    return _.map(result.data, function(d) {
      var x = {
        text: "",
        expandable: true
      };
      try {
        x = {
          text: d.name,
          expandable: true
        };
      } catch (e) { console.log("bad data");}
      return x;
    });
  }

  /**
   * [getClientNames description]
   * @param  {[type]} dimensions [description]
   * @return {[type]}            [description]
   */
  getClientNames(dimensions) {
    var values = [];
    for (var i = 0; i < dimensions.length; i++) {
      if (dimensions[i].dimensionType === 'clientName') {
        var aDimension = dimensions[i].value;
        if (this.templateSrv.getVariableName(aDimension)) {
          // template variable found, expand it
          var templateVar = this.templateSrv.replace(aDimension);
          if (templateVar.length > 0) {
            // the expanded variable comes back as { value1 , value2 }
            // or it comes back as just a value
            if (templateVar.startsWith('{')) {
              templateVar = templateVar.slice(1, -1);
              var templateVars = templateVar.split(',');
              values.push.apply(values, templateVars);
            } else {
              values.push(templateVar);
            }
          }
        } else {
          values.push(aDimension);
        }
      }
    }
    //console.log(values);
    return values;
  }

  /**
   * [getCheckNames description]
   * @param  {[type]} dimensions [description]
   * @return {[type]}            [description]
   */
  getCheckNames(dimensions) {
    var values = [];
    for (var i = 0; i < dimensions.length; i++) {
      if (dimensions[i].dimensionType === 'checkName') {
        var aDimension = dimensions[i].value;
        if (this.templateSrv.getVariableName(aDimension)) {
          // template variable found, expand it
          var templateVar = this.templateSrv.replace(aDimension);
          if (templateVar.length > 0) {
            // the expanded variable comes back as { value1 , value2 }
            // or it comes back as just a value
            if (templateVar.startsWith('{')) {
              templateVar = templateVar.slice(1, -1);
              var templateVars = templateVar.split(',');
              values.push.apply(values, templateVars);
            } else {
              values.push(templateVar);
            }
          }
        } else {
          values.push(aDimension);
        }
      }
    }
    return values;
  }

  /**
   * [getAggregateNames description]
   * @param  {[type]} dimensions [description]
   * @return {[type]}            [description]
   */
  getAggregateNames(dimensions) {
    var values = [];
    for (var i = 0; i < dimensions.length; i++) {
      if (dimensions[i].dimensionType === 'aggregateName') {
        var aDimension = dimensions[i].value;
        if (this.templateSrv.getVariableName(aDimension)) {
          // template variable found, expand it
          var templateVar = this.templateSrv.replace(aDimension);
          if (templateVar.length > 0) {
            // the expanded variable comes back as { value1 , value2 }
            // or it comes back as just a value
            if (templateVar.startsWith('{')) {
              templateVar = templateVar.slice(1, -1);
              var templateVars = templateVar.split(',');
              values.push.apply(values, templateVars);
            } else {
              values.push(templateVar);
            }
          }
        } else {
          values.push(aDimension);
        }
      }
    }
    return values;
  }

  replaceFilterValues(filters) {
    for (var i = 0; i < filters.length; i++) {
      var aFilter = filters[i];
      switch (aFilter.filterType) {
        case 'field':
          /*jshint -W087 */
          //debugger;
          // Field filters have these properties
          // filterFieldName
          // filterFieldValue
          var aFieldName = aFilter.filterFieldName;
          var aFieldValue = aFilter.filterFieldValue;
          var templatedValue = this.templateSrv.replace(aFieldValue);
          aFilter.filterFieldValueReplaced = templatedValue;
          break;
      }
    }
    return filters;
  }

  /**
   * [getQueryURIByType description]
   * @param  {[type]} target [description]
   * @return {[type]}        [Array of URIs]
   */
  getQueryURIByType(target) {
    var URIs = [];
    var dimensionURI = '/events';
    var clientNames = null;
    var checkNames = null;
    var aggregateNames = null;
    if (target.dimensions !== undefined) {
      clientNames = this.getClientNames(target.dimensions);
      checkNames = this.getCheckNames(target.dimensions);
      aggregateNames = this.getAggregateNames(target.dimensions);
    }
    if (target.filters !== undefined) {
      // convert all templated values
      this.replaceFilterValues(target.filters);
      /*jshint -W087 */
      //debugger;
    }
    if (target.alias !== undefined) {
      target.aliasReplaced = this.templateSrv.replace(target.alias);
    }

    switch (target.sourceType) {
      case 'aggregates':
      case 'aggregates_json':
        // https://sensuapp.org/docs/0.28/api/aggregates-api.html
        URIs = getAggregateURIs(target, aggregateNames);
        break;
      case 'check_subscriptions':
        // https://sensuapp.org/docs/0.28/api/checks-api.html
        //
        // Returns list of subscription names, with the corresponding checks for the subscription
        // Dimensions are:
        //    name - name of check
        //    aggregate - name of aggregate
        //    type (metric|check)
        //    source - JIT client
        //
        break;
      case 'client_health_json':
        URIs = getClientHealthURIs(clientNames);
        break;
      case 'clients':
      case 'clients_json':
        // https://sensuapp.org/docs/0.28/api/clients-api.html
        URIs = getClientsURIs(checkNames, clientNames);
        break;
      case 'clienthistory':
        // https://sensuapp.org/docs/0.28/api/clients-api.html
        // look for clientName in dimensions
        URIs = getClientHistoryURIs(clientNames);
        break;
      case 'event_metrics':
      case 'event_metrics_json':
      case 'events':
      case 'events_json':
        // https://sensuapp.org/docs/0.28/api/events-api.html
        URIs = getEventsURIs(checkNames, clientNames);
        break;
      case 'results_json':
      case 'results_table':
        // https://sensuapp.org/docs/0.28/api/results-api.html
        URIs = getResultURIs(checkNames, clientNames);
        break;
      case 'sensu_health_json':
        // https://sensuapp.org/docs/0.28/api/health-and-info-api.html
        break;
      case 'silenced_entries_json':
        // https://sensuapp.org/docs/0.28/api/silenced-api.html
        break;
      case 'stashes_json':
        // https://sensuapp.org/docs/0.28/api/stashes-api.html
        break;
    }
    return URIs;
  }

  getBuckets(responses) {
    var buckets = {};
    for (var i = 0; i < responses.data.length; i++) {
      var refId = responses.data[i].target.refId;
      if (buckets.hasOwnProperty(refId)) {
        buckets[refId].push(responses.data[i]);
      } else {
        buckets[refId] = [responses.data[i]];
      }
    }
    /*jshint -W087 */
    //debugger;
    return buckets;
  }

  processConversions(sourceType, aTarget, responses) {
    var result = [];
    switch (sourceType) {
      case 'aggregates':
        result = convertAggregatesToDataPoints(aTarget, responses);
        break;
      case 'aggregates_json':
        result = convertAggregatesToJSON(aTarget, responses);
        return result;
      case 'clients':
        result = convertClientsToDataPoints(aTarget, responses);
        return result;
      case 'clients_json':
        result = convertClientsToJSON(aTarget, responses);
        return result;
      case 'client_health_json':
        result = convertClientHealthToJSON(aTarget, responses);
        return result;
      case 'clienthistory':
        result = convertClientHistoryToDataPoints(aTarget, responses);
        break;
      case 'events':
        result = convertEventsToDataPoints(aTarget, responses);
        break;
      case 'events_json':
        result = convertEventsToJSON(aTarget, responses);
        break;
      case 'event_metrics':
        result = convertEventsToEventMetrics(aTarget, responses);
        break;
      case 'event_metrics_json':
        result = convertEventsToEventMetricsJSON(aTarget, responses);
        break;
      case 'results_json':
        result = convertResultsToJSON(aTarget, responses);
        break;
      case 'results_table':
        result = convertResultsToTable(aTarget, responses);
        break;
      default:
        console.log("Unknown source type");
        break;
    }
    return result;
  }

  setRawTargets(aTarget, result) {
    // keep the actual name
    for (let i = 0; i < result.data.length; i++) {
      result.data[i].rawTarget = result.data[i].target;
    }
    return result;
  }

  processFilters(aTarget, result) {
    // if there are no filters, return all data[] items
    if ((aTarget.filters !== undefined) && (aTarget.filters.length > 0)) {
      var filterData = [];
      for (let i = 0; i < aTarget.filters.length; i++) {
        var aFilter = aTarget.filters[i];
        // iterate over the data, find matching targets
        for (let j = 0; j < result.data.length; j++) {
          var aRawTarget = result.data[j].rawTarget;
          if (aFilter.filterType === aRawTarget) {
            // Prepend Alias
            if (aTarget.aliasReplaced) {
              result.data[j].target = aTarget.aliasReplaced + " " + aRawTarget;
            }
            // save this result
            filterData.push(result.data[j]);
          }
        }
      }
      // if we have filtered data, replace the result with it
      if (filterData.length > 0) {
        result.data = filterData;
      }
    } else {
      // if there are no filters, apply the alias (this is probably not what you want, but allow it...)
      if (aTarget.aliasReplaced) {
        for (let i = 0; i < result.data.length; i++) {
          result.data[i].target = aTarget.aliasReplaced;
        }
      }
    }

    return result;
  }
  /**
   * [parseQueryResult description]
   * @param  {[type]} aTarget  [description]
   * @param  {[type]} responses Array of Responses, containing data[{ target: aTarget, response: response}]
   * @return {[type]}          [description]
   */
  parseQueryResult(responses) {

    // This will match refId's for responses and bucket them together, then pass the bucket to the conversion routines
    // This allows multiple responses intended for a single target to all be processed at once
    // It is up to the processor to use the data sent, and return a result that can be used.
    var allResults = { data: [] };
    if (!responses || !responses.data) {
      return allResults;
    }
    var buckets = this.getBuckets(responses);

    // iterate over the keys in the buckets to get the target and source type
    var bucketKeys = Object.keys(buckets);
    for (let i = 0; i < bucketKeys.length; i++) {
      let aKey = bucketKeys[i];
      let sourceType = buckets[aKey][0].target.sourceType;
      // also use the target from the first response
      let aTarget = buckets[aKey][0].target;
      // convert results according to the sourceType
      // IMPORTANT: do not allow responses to be modifed, return a new object!
      let result = this.processConversions(sourceType, aTarget, responses);
      // update result with the rawTarget name (preserve name from aliasing)
      result = this.setRawTargets(aTarget, result);
      // apply filters
      result = this.processFilters(aTarget, result);
      // iterate over all of the results and push into allResults
      for (let i = 0; i < result.data.length; i++) {
        allResults.data.push(result.data[i]);
      }
    }
    return allResults;
  }

  /**
   *
   */
  getCheckInterval(client, checkName) {
    // http://10.227.86.62/results/default-oel-67-x86-64/keepalive
    /* The check may not have interval defined, which means it is defaulted to 60 seconds
    {
      "client": "default-oel-67-x86-64",
      "check": {
        "thresholds": {
          "warning": 120,
          "critical": 180
        },
        "name": "keepalive",
        "issued": 1476277039,
        "executed": 1476277039,
        "output": "No keepalive sent from client for 40860 seconds (>=180)",
        "status": 2,
        "type": "standard"
      }
    }
     */
  }

  /**
   * [dimensionFindValues description]
   * @param  {[type]} target    [description]
   * @param  {[type]} dimension [description]
   * @return {[type]}           [description]
   */
  dimensionFindValues(target, dimension) {
    var dimensionURI = '/clients';

    switch (dimension.dimensionType) {
      case 'clientName':
        dimensionURI = '/clients';
        break;
      case 'checkName':
        dimensionURI = '/checks';
        break;
      case 'aggregateName':
        dimensionURI = '/aggregates';
        break;
    }
    return this.backendSrv.datasourceRequest({
      url: this.url + dimensionURI,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": this.basicAuth
      }
    }).then(this.mapToTextValue);
  }

  mapToTextValue(result) {
    return _.map(result.data, (d, i) => {
      return {
        text: d.name,
        value: d.name
      };
    });
  }

  /**
   * [dimensionFindValues description]
   * @param  {[type]} target    [description]
   * @param  {[type]} filter [description]
   * @return {[type]}           [description]
   */
  filterFindValues(target, filter) {
    var filterURI = '/clients';
    switch (filter.filterType) {
      case 'clientName':
        filterURI = '/clients';
        break;
      case 'checkName':
        filterURI = '/checks';
        break;
      case 'aggregateName':
        filterURI = '/aggregates';
        break;
    }
    return this.backendSrv.datasourceRequest({
      url: this.url + filterURI,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": this.basicAuth
      }
    }).then(this.mapToTextValue);
  }

  query(options) {
    //console.log("query entered");
    var queries = [];
    var _this = this;
    var singleTarget = null;
    options.targets.forEach(function(target) {
      // TODO handle hide and no target specified
      //if (target.hide || !target.target) {
      //  continue;
      //}
      queries.push(target);
    });
    var interval = options.interval;
    //console.log("options interval = " + interval);
    if (kbn.interval_to_ms(interval) < this.minimumInterval) {
      // console.log("Detected interval smaller than allowed: " + interval);
      interval = kbn.secondsToHms(this.minimumInterval / 1000);
      // console.log("New Interval: " + interval);
    }
    //console.log("interval after min check = " + interval);
    var deferred = this.q.defer();

    // if there are no queries, return empty data
    if (queries.length === 0) {
      // console.log("no tags visible or specified, no data to fetch");
      deferred.resolve({
        data: []
      });
      return deferred.promise;
    }
    var allQueries = this.q.all({
      first: _this.multipleDataQueries(queries),
    });
    allQueries.then(function(results) {
      // return results from queries
      deferred.resolve(results.first);
    });
    return deferred.promise;
  }

  singleDataQuery(singleTarget, uriType) {
    //console.log("singleDataQuery entered");
    var _this = this;
    var deferred = this.q.defer();
    var params = {};
    var httpOptions = {
      method: 'GET',
      url: this.url + uriType,
      params: params,
      headers: {
        'Content-Type': 'application/json',
        "Authorization": this.basicAuth
      }
    };
    this.backendSrv.datasourceRequest(httpOptions)
      .then(function(response) {
        var anError = null;
        if (response.status !== 200) {
          console.log("error...");
          anError = new Error("Bad Status: " + response.status);
          deferred.reject(anError);
        }
        if (!response.data) {
          anError = new Error("No data");
          deferred.reject(anError);
        }
        // this used to parse per response, instead this is returning the target and response to be later
        // used by multiDone
        // OLD: deferred.resolve(_this.parseQueryResult(singleTarget, response));
        deferred.resolve({ target: singleTarget, response: response});
      }, function(response) {
        console.error('Unable to load data. Response: %o', response.data ? response.data.message : response);
        var error = new Error("Unable to load data");
        deferred.reject(error);
      });

    return deferred.promise;
  }

  /**
   * Wrapper called when all queries have been completed.
   * @param  {[type]} responses [description]
   * @return {[type]}           [description]
   */
  multiDone(responses) {
    /*jshint -W087 */
    //debugger;
    return this.parseQueryResult(responses);
  }

  /**
   * Leverages promises to perform multiple async queries
   * @param  {[type]} pendingQueries [description]
   * @return {[type]}                [description]
   */
  multipleDataQueries(pendingQueries) {
    var deferred = this.q.defer();
    var dataCalls = [];
    var _this = this;
    // for each query, we get a list of sensu uris' to hit
    // to retrieve the data
    angular.forEach(pendingQueries, function(aTarget) {
      var uriList = _this.getQueryURIByType(aTarget);
      for (var i = 0; i < uriList.length; i++) {
        dataCalls.push(_this.singleDataQuery(aTarget, uriList[i]));
      }
    });
    this.q.all(dataCalls)
      .then(
        function(results) {
          var response = {
            data: []
          };
          // merge all of the results into one response
          angular.forEach(results, function(result) {
            response.data.push(result);
            //angular.forEach(result.data, function(dataSet) {
            //  response.data.push(dataSet);
            //});
          });
          // multiDone needs to return all of the parsed results inside somevar.data[]
          deferred.resolve(_this.multiDone(response));
        },
        function(errors) {
          deferred.reject(errors);
        },
        function(updates) {
          deferred.update(updates);
        }
      );
    return deferred.promise;
  }

  // Required
  // Used for testing datasource in datasource configuration pange
  //    'Access-Control-Allow-Origin': "http://localhost:3000"
  //

  /**
   * [testDatasource description]
   * @return {[type]} [description]
   */
  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/info',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": this.basicAuth
      },
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return {
          status: "success",
          message: "Data source is working",
          title: "Success"
        };
      }
    });
  }
}
