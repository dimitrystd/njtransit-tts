const aws = require('aws-sdk');

async function textToSpeech(req, res) {

    const {voiceId = 'Kimberly', text = '', filename = 'speech.mp3'} = req.body;

    try {
        const audio = await generatePollyAudio(text, voiceId);
        res.send(audio.AudioStream);
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
const generatePollyAudio = (text, voiceId) => {
    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId // see Polly API for the list http://docs.aws.amazon.com/fr_fr/polly/latest/dg/API_Voice.html#API_Voice_Contents
    };
    const polly = new aws.Polly({
        region: 'us-east-1'
    });
    return polly.synthesizeSpeech(params).promise().then(audio => {
            if (audio.AudioStream instanceof Buffer) {
                return audio;
            }
            else {
                throw 'AudioStream is not a Buffer.';
            }
        }
    )
};

module.exports = {
    textToSpeech
};