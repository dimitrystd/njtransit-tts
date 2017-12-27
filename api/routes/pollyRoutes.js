'use strict';

module.exports = function(app) {
    var polly = require('../controllers/pollyController');

    app.route('/route/:route/stop/:stop/tts')
        .post(polly.textToSpeech);
};
