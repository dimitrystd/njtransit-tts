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
});