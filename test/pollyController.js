const expect = require('chai').expect;
const pollyController = require('../api/controllers/pollyController');

describe('pollyController', function() {
    describe('Generate file name', function() {
        it('Short name', function() {
            const filename = pollyController.generateFilename('short text', 'polly');
            expect(filename).to.equal('short_text_e9ff676729cb0d77def8bd8844edd83e.mp3');
        });

        it('Long name', function() {
            const filename = pollyController.generateFilename('very long text very long text very long text very long text very long text very long text', 'polly');
            expect(filename).to.equal('very_long_text_very_long_text_very_long_text_very__363a0e15e46c1acd681c1b471a13ea3b.mp3');
        });

        it('Case insensitive', function() {
            const filename = pollyController.generateFilename('sHOrt Text', 'polly');
            expect(filename).to.equal('short_text_e9ff676729cb0d77def8bd8844edd83e.mp3');
        });

        it('Special characters', function() {
            const filename = pollyController.generateFilename('tes:t\ (string) /te#st', 'polly');
            expect(filename).to.equal('tes_t__string___te_st_450dfe92b7f14e91d861105355355e7f.mp3');
        });
    });
});