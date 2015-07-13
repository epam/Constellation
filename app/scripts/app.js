var App = window.App = Ember.Application.create({LOG_ACTIVE_GENERATION: true});


/* Order and include as you please. */
require('scripts/localization/*');


require('scripts/core/*');
require('scripts/core/util/*');
require('scripts/store');
require('scripts/models/*');

require('scripts/controllers/*');
require('scripts/controllers/navigationMenu/*');
require('scripts/controllers/grid/*');
require('scripts/controllers/mainPage/*');
require('scripts/controllers/widget/*');
require('scripts/controllers/dialog/*');


require('scripts/views/*');
require('scripts/views/navigationMenu/*');
require('scripts/views/grid/*');
require('scripts/views/mainPage/*');
require('scripts/views/widget/*');
require('scripts/views/dialog/*');

require('scripts/router');
require('scripts/routes/*');

require('scripts/fonts/*');

App.SkinSelectorController.create().applyCssSkin();
