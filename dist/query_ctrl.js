"use strict";

System.register(["angular", "lodash", "app/plugins/sdk", "./css/query-editor.css!"], function (_export, _context) {
  "use strict";

  var angular, _, QueryCtrl, _createClass, SensuDatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("SensuDatasourceQueryCtrl", SensuDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(SensuDatasourceQueryCtrl, _QueryCtrl);

        function SensuDatasourceQueryCtrl($scope, $injector, templateSrv, uiSegmentSrv) {
          _classCallCheck(this, SensuDatasourceQueryCtrl);

          var _this = _possibleConstructorReturn(this, (SensuDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(SensuDatasourceQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;
          _this.uiSegmentSrv = uiSegmentSrv;
          _this.templateSrv = templateSrv;
          // source types for the popdown
          _this.sourceTypes = [{
            text: 'Aggregates',
            value: 'aggregates'
          }, {
            text: 'Aggregates as JSON',
            value: 'aggregates_json'
          }, {
            text: 'Check Subscriptions',
            value: 'check_subscriptions'
          }, {
            text: 'Clients',
            value: 'clients'
          }, {
            text: 'Clients as JSON',
            value: 'clients_json'
          }, {
            text: 'Client Health as JSON',
            value: 'client_health_json'
          }, {
            text: 'Client History',
            value: 'client_history'
          }, {
            text: 'Events',
            value: 'events'
          }, {
            text: 'Events as JSON',
            value: 'events_json'
          }, {
            text: 'Event Metrics',
            value: 'event_metrics'
          }, {
            text: 'Event Metrics JSON',
            value: 'event_metrics_json'
          }, {
            text: 'Results as JSON',
            value: 'results_json'
          }, {
            text: 'Results as Table',
            value: 'results_table'
          }, {
            text: 'Sensu Health',
            value: 'sensu_health_json'
          }, {
            text: 'Silenced Entries',
            value: 'silenced_entries_json'
          }, {
            text: 'Stashes',
            value: 'stashes_json'
          }];

          // Each source type have different dimensions
          //   //    name - name of check
          //    aggregate - name of aggregate
          //    type (metric|check)
          //    source - JIT client
          _this.dimensionTypes = {
            aggregates: [{
              text: 'Aggregate Name',
              value: 'aggregateName'
            }],
            aggregates_json: [{
              text: 'Aggregate Name',
              value: 'aggregateName'
            }],
            check_subscriptions: [{
              text: 'Aggregate Name',
              value: 'aggregateName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }, {
              text: 'Check Type',
              value: 'checkType'
            }, {
              text: 'Source (JIT Client)',
              value: 'sourceName'
            }],
            clients: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            client_health_json: [{
              text: 'Client Name',
              value: 'clientName'
            }],
            client_history: [{
              text: 'Client Name',
              value: 'clientName'
            }],
            clients_json: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            events: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            events_json: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            event_metrics: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            event_metrics_json: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            results_json: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            results_table: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            sensu_health_json: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            silenced_entries_json: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }],
            stashes_json: [{
              text: 'Client Name',
              value: 'clientName'
            }, {
              text: 'Check Name',
              value: 'checkName'
            }]
          };

          // same
          _this.filterTypes = {
            aggregates: [{
              text: 'Number of Checks',
              value: 'checks',
              type: 'value'
            }, {
              text: 'Number of Clients',
              value: 'clients',
              type: 'value'
            }, {
              text: 'State Critical',
              value: 'critical',
              type: 'value'
            }, {
              text: 'State OK',
              value: 'ok',
              type: 'value'
            }, {
              text: 'State Stale',
              value: 'stale',
              type: 'value'
            }, {
              text: 'State Unknown',
              value: 'unknown',
              type: 'value'
            }, {
              text: 'State Warning',
              value: 'warning',
              type: 'value'
            }, {
              text: 'Total Checks',
              value: 'total',
              type: 'value'
            }],
            client_health_json: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }],
            clients: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }, {
              text: 'Field',
              value: 'field'
            }],
            clients_json: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }, {
              text: 'Field',
              value: 'field'
            }],
            events: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }, {
              text: 'Check Name RegEx',
              value: 'regex'
            }, {
              text: 'Field',
              value: 'field'
            }],
            events_json: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }, {
              text: 'Check Name RegEx',
              value: 'regex'
            }, {
              text: 'Field',
              value: 'field'
            }],
            event_metrics: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }, {
              text: 'Check Name RegEx',
              value: 'regex'
            }, {
              text: 'Field',
              value: 'field'
            }],
            event_metrics_json: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }, {
              text: 'Check Name RegEx',
              value: 'regex'
            }, {
              text: 'Field',
              value: 'field'
            }],
            results_json: [{
              text: 'Client Name',
              value: 'fetch'
            }, {
              text: 'Client Name RegEx',
              value: 'regex'
            }, {
              text: 'Check Name RegEx',
              value: 'regex'
            }, {
              text: 'Field',
              value: 'field'
            }]
          };

          _this.aggregateModes = [{
            text: 'List',
            value: 'list'
          }, {
            text: 'Clients',
            value: 'clients'
          }, {
            text: 'Checks',
            value: 'checks'
          }, {
            text: 'Results Critical',
            value: 'results_critical'
          }, {
            text: 'Results OK',
            value: 'results_ok'
          }, {
            text: 'Results Unknown',
            value: 'results_unknown'
          }, {
            text: 'Results Warning',
            value: 'results_warning'
          }];

          _this.clientQueryModes = [{
            text: 'List',
            value: 'list'
          }, {
            text: 'Count',
            value: 'count'
          }];

          _this.eventMetricModes = [{
            text: 'All Events',
            value: 'all_events_count'
          }, {
            text: 'Active Events',
            value: 'all_events_count'
          }, {
            text: 'Critical Count',
            value: 'critical_count'
          }, {
            text: 'Critical Active Count',
            value: 'critical_active_count'
          }, {
            text: 'Critical Silenced Count',
            value: 'critical_silenced_count'
          }, {
            text: 'Warning Count',
            value: 'warning_count'
          }, {
            text: 'Warning Silenced Count',
            value: 'warning_silenced_count'
          }, {
            text: 'Warning Active Count',
            value: 'warning_active_count'
          }, {
            text: 'Unknown Count',
            value: 'unknown_count'
          }, {
            text: 'Unknown Active Count',
            value: 'unknown_active_count'
          }, {
            text: 'Unknown Silenced Count',
            value: 'unknown_silenced_count'
          }, {
            text: 'Silenced Count',
            value: 'silenced_count'
          }, {
            text: 'Clients Silenced Count',
            value: 'clients_silenced_count'
          }, {
            text: 'Checks Silenced Count',
            value: 'checks_silenced_count'
          }];
          _this.target.clientQueryMode = _this.target.clientQueryMode || 'count';
          _this.target.eventMetricMode = _this.target.eventMetricMode || 'all_events_count';

          _this.target.aggregateMode = _this.target.aggregateMode || 'list';
          // default source type is events
          _this.target.sourceType = _this.target.sourceType || 'events';
          // no dimensions initially
          _this.target.dimensions = _this.target.dimensions || [];
          return _this;
        }

        /**
         * [removeDimension description]
         * @param  {[type]} dimension [description]
         * @return {[type]}           [description]
         */


        _createClass(SensuDatasourceQueryCtrl, [{
          key: "removeDimension",
          value: function removeDimension(dimension) {
            if (this.target.dimensions) {
              this.target.dimensions.splice(this.target.dimensions.indexOf(dimension), 1);
              this.panelCtrl.refresh();
            }
          }
        }, {
          key: "addDimension",
          value: function addDimension() {
            if (!this.target.dimensions) {
              this.target.dimensions = [];
            }
            var dimensionsForSourceType = this.dimensionTypes[this.target.sourceType];
            var defaultDimensionType = dimensionsForSourceType[0].value;
            this.target.dimensions.push({
              name: null,
              value: null,
              dimensionType: defaultDimensionType
            });
          }
        }, {
          key: "getDimensionValues",
          value: function getDimensionValues(dimension) {
            if (dimension) {
              //console.log("have a dimension, getting available values");
              return this.datasource.dimensionFindValues(this.target, dimension).then(this.uiSegmentSrv.transformToSegments(true));
            }
          }
        }, {
          key: "removeFilter",
          value: function removeFilter(filter) {
            if (this.target.filters) {
              this.target.filters.splice(this.target.filters.indexOf(filter), 1);
              this.panelCtrl.refresh();
            }
          }
        }, {
          key: "addFilter",
          value: function addFilter() {
            if (!this.target.filters) {
              this.target.filters = [];
            }
            var filtersForSourceType = this.filterTypes[this.target.sourceType];
            var defaultFilterType = filtersForSourceType[0].type;
            this.target.filters.push({
              name: null,
              value: null,
              filterType: defaultFilterType
            });
          }
        }, {
          key: "getFilterValues",
          value: function getFilterValues(filter) {
            if (filter) {
              //console.log("have a dimension, getting available values");
              return this.datasource.filterFindValues(this.target, filter).then(this.uiSegmentSrv.transformToSegments(true));
            }
          }
        }, {
          key: "getOptions",
          value: function getOptions() {
            return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(true));
            // Options have to be transformed by uiSegmentSrv to be usable by metric-segment-model directive
          }
        }, {
          key: "sourceTypeChanged",
          value: function sourceTypeChanged() {
            // reset dimensions
            if (this.target.dimensions) {
              this.target.dimensions = [];
            }
            this.onChangeInternal();
          }
        }, {
          key: "modeChanged",
          value: function modeChanged() {
            this.onChangeInternal();
          }
        }, {
          key: "onChangeInternal",
          value: function onChangeInternal() {
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }]);

        return SensuDatasourceQueryCtrl;
      }(QueryCtrl));

      _export("SensuDatasourceQueryCtrl", SensuDatasourceQueryCtrl);

      SensuDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
