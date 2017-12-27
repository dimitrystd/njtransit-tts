const aws = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const urljoin  = require('url-join');
const busController = require('./busController');

async function scheduleTts(req, res) {
    req.body = {
        voiceId: req.params.voice,
        text: busController.getAndParseNjTransitSchedule(req.params.route, req.params.stop)
    };
    textToSpeech(req, res);
}

async function textToSpeech(req, res) {
    const {voiceId = 'Kimberly', text = ''} = req.body;

    try {
        const filename = generateFilename(text, req.params.voice);
        const filePath = path.join(global.mediaDir, filename);
        if (!checkInCache(filePath)) {
            await generatePollyAudio(text, voiceId, filePath);
        }
        res.send(urljoin(global.staticRoute, filename));
    }
    catch (e) {
        if (e.errorCode && e.error) {
            res.status(e.errorCode).send(e.error);
        }
        else {
            res.status(500).send(e);
        }
    }
}

// Generate audio from Polly and check if output is a Buffer
function generatePollyAudio(text, voiceId, filename) {
    const polly = new aws.Polly({
        region: 'us-east-1'
    });
    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId // see Polly API for the list http://docs.aws.amazon.com/polly/latest/dg/API_Voice.html#API_Voice_Contents
    };
    return polly.synthesizeSpeech(params).promise().then(audio => {
            if (audio.AudioStream instanceof Buffer) {
                fs.writeFileSync(filename, audio.AudioStream);
            }
            else {
                throw 'AudioStream is not a Buffer.';
            }
        }
    )
}

function generateFilename(text, voiceId) {
    const hash = crypto.createHash('md5').update((text + voiceId).toLowerCase()).digest("hex");
    return text.slice(0, 50).replace(/[\s\:#\(\)\\\/]/g, '_').toLowerCase() + '_' + hash + '.mp3';
}

function checkInCache(filePath) {
    if (!fs.existsSync(global.mediaDir)) {
        fs.mkdirSync(global.mediaDir);
    }
    return fs.existsSync(filePath);
}

module.exports = {
    scheduleTts,
    textToSpeech,
    generateFilename
};