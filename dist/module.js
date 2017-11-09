'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var SensuDatasource, SensuDatasourceQueryCtrl, SensuConfigCtrl, SensuQueryOptionsCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      SensuDatasource = _datasource.SensuDatasource;
    }, function (_query_ctrl) {
      SensuDatasourceQueryCtrl = _query_ctrl.SensuDatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', SensuConfigCtrl = function SensuConfigCtrl() {
        _classCallCheck(this, SensuConfigCtrl);
      });

      SensuConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', SensuQueryOptionsCtrl = function SensuQueryOptionsCtrl() {
        _classCallCheck(this, SensuQueryOptionsCtrl);
      });

      SensuQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('Datasource', SensuDatasource);

      _export('QueryCtrl', SensuDatasourceQueryCtrl);

      _export('ConfigCtrl', SensuConfigCtrl);

      _export('QueryOptionsCtrl', SensuQueryOptionsCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
