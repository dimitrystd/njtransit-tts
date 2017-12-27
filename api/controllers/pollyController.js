const aws = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function textToSpeech(req, res) {

    const {voiceId = 'Kimberly', text = ''} = req.body;

    try {
        const filename = await generatePollyAudio(text, voiceId);
        res.send(filename);
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
function generatePollyAudio(text, voiceId) {
    const polly = new aws.Polly({
        region: 'us-east-1'
    });
    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId // see Polly API for the list http://docs.aws.amazon.com/fr_fr/polly/latest/dg/API_Voice.html#API_Voice_Contents
    };
    return polly.synthesizeSpeech(params).promise().then(audio => {
            if (audio.AudioStream instanceof Buffer) {
                const filename = path.join(__dirname, generateFilename(text, voiceId));
                fs.writeFileSync(filename, audio.AudioStream);
                return filename;
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

module.exports = {
    textToSpeech,
    generateFilename
};