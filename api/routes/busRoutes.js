'use strict';

module.exports = function(app) {
	const bus = require('../controllers/busController');

	app.route('/route/:route/stop/:stop/eta')
		.get(bus.get_eta);
};
