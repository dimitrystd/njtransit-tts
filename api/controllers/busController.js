var request = require('sync-request');
var xml2js = require('xml2js');

exports.get_eta = function(req, res) {
    var route = req.params.route;
    var stop = req.params.stop;
    var response = request('GET', `http://mybusnow.njtransit.com/bustime/eta/getStopPredictionsETA.jsp?route=${route}&stop=${stop}`);
    if (response && response.statusCode > 200) {
        res.send(`Could not receive bus ETA. I got status code: ${response.statusCode}`);
    } else {
        var parser = new xml2js.Parser();
        parser.parseString(response.body, function (err, result) {
            if (err) {
                res.send(`Could not parse data with bus schedule. I got error: ${err}`);
            } else {
                if (result['stop']['noPredictionMessage']) {
                    res.send(`There is not schedule for bus ${route}`);
                } else {
                    res.send('not implemented');
                }
            }
        });
    }
};
