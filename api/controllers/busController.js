const request = require('sync-request');
const parseStringSync = require('xml2js-parser').parseStringSync;

function get_eta (req, res) {
    res.send(getAndParseNjTransitSchedule(req.params.route, req.params.stop));
}

function getAndParseNjTransitSchedule(route, stop) {
    const response = request('GET', `http://mybusnow.njtransit.com/bustime/eta/getStopPredictionsETA.jsp?route=${route}&stop=${stop}`);
    if (response && response.statusCode > 200) {
        return `Could not receive bus ETA. I got status code: ${response.statusCode}`;
    } else {
        return parseBusSchedule(response.body);
    }
}

function parseBusSchedule (xml) {
    const result = parseStringSync(xml, {normalize: true});
    if (result['stop']['noPredictionMessage']) {
        return `There is not schedule for bus`;
    } else {
        if (!result['stop'] || !result['stop']['pre'] || result['stop']['pre'].length === 0) {
            return `Could not parse data with bus schedule. It doesn't contain information about routs`;
        } else {
            const firstBus = result['stop']['pre'][0];
            const interval = firstBus.pt[0] + ' ' +firstBus.pu[0].toLowerCase();
            const time = firstBus.nextbusonroutetime;
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
    getAndParseNjTransitSchedule,
    parseBusSchedule
};
