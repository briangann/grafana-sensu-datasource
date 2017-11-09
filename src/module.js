import {SensuDatasource} from './datasource';
import {SensuDatasourceQueryCtrl} from './query_ctrl';

class SensuConfigCtrl {}
SensuConfigCtrl.templateUrl = 'partials/config.html';

class SensuQueryOptionsCtrl {}
SensuQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

export {
  SensuDatasource as Datasource,
  SensuDatasourceQueryCtrl as QueryCtrl,
  SensuConfigCtrl as ConfigCtrl,
  SensuQueryOptionsCtrl as QueryOptionsCtrl
};
