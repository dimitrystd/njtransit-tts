const request = require('sync-request');
const parseStringSync = require('xml2js-parser').parseStringSync;

function get_eta (req, res) {
    var route = req.params.route;
    var stop = req.params.stop;
    var response = request('GET', `http://mybusnow.njtransit.com/bustime/eta/getStopPredictionsETA.jsp?route=${route}&stop=${stop}`);
    if (response && response.statusCode > 200) {
        res.send(`Could not receive bus ETA. I got status code: ${response.statusCode}`);
    } else {
        res.send(parseBusSchedule(response.body));
    }
};

function parseBusSchedule (xml) {
    var result = parseStringSync(xml, {normalize: true});
    if (result['stop']['noPredictionMessage']) {
        return `There is not schedule for bus`;
    } else {
        if (!result['stop'] || !result['stop']['pre'] || result['stop']['pre'].length == 0) {
            return `Could not parse data with bus schedule. It doesn't contain information about routs`;
        } else {
            var firstBus = result['stop']['pre'][0];
            var interval = firstBus.pt[0] + firstBus.pu[0].toLowerCase();
            var time = firstBus.nextbusonroutetime;
            if (firstBus.pt < 6) {
                return `Bus will arrive in ${interval}, at ${time}. Hurry up`;
            } else {
                return `Bus will arrive in ${interval}, at ${time}`;
            }
        }
    }
}

module.exports = {
    get_eta,
    parseBusSchedule
}