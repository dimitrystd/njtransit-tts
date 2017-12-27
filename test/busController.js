const expect = require('chai').expect;
const fs = require('fs');
const busController = require('../api/controllers/busController');

describe('busController', function() {
    describe('Parse XML', function() {
        it('No schedule', function() {
            var xmlFile = fs.readFileSync('test/resources/noServiceScheduled.xml');
            expect(busController.parseBusSchedule(xmlFile)).to.contains('There is not schedule for bus');
        });

        it('Unexpected xml structure', function() {
            var xmlFile = fs.readFileSync('test/resources/invalidXmlStructure.xml');
            expect(busController.parseBusSchedule(xmlFile)).to.contains('Could not parse data');
        });

        it('Will arrive less than 6 mins', function() {
            var xmlFile = fs.readFileSync('test/resources/busWillArriveIn5min.xml');
            expect(busController.parseBusSchedule(xmlFile)).to.contains('Hurry up');
        });
    });

    describe('NJTrasit API', function() {
        it('All routes', function () {
            expect(busController.getAndParseNjTransitSchedule('all', 11405)).to.not.contains('Could not receive bus ETA');
        });

        it('158 bus route', function () {
            expect(busController.getAndParseNjTransitSchedule('158', 11405)).to.not.contains('Could not receive bus ETA');
        });

        it('Invalid stop #', function () {
            expect(busController.getAndParseNjTransitSchedule('all', 'sdffwfw')).to.not.contains('Could not receive bus ETA');
        });
    });
});