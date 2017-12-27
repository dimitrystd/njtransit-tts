'use strict';

module.exports = function(app) {
    var polly = require('../controllers/pollyController');

    app.route('/route/:route/stop/:stop/voice/:voice/tts')
        .get(polly.scheduleTts);
    app.route('/tts')
        .post(polly.textToSpeech);

};
