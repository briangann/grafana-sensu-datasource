'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _query_ctrl = require('./query_ctrl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SensuConfigCtrl = function SensuConfigCtrl() {
  _classCallCheck(this, SensuConfigCtrl);
};

SensuConfigCtrl.templateUrl = 'partials/config.html';

var SensuQueryOptionsCtrl = function SensuQueryOptionsCtrl() {
  _classCallCheck(this, SensuQueryOptionsCtrl);
};

SensuQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

exports.Datasource = _datasource.SensuDatasource;
exports.QueryCtrl = _query_ctrl.SensuDatasourceQueryCtrl;
exports.ConfigCtrl = SensuConfigCtrl;
exports.QueryOptionsCtrl = SensuQueryOptionsCtrl;
//# sourceMappingURL=module.js.map
