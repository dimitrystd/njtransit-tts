# REST API
## NJTransit schedule
Get NJTransit schedule for specific route and bus stop and convert it to human readable text.
```
curl -X GET http://localhost:3000/route/158/stop/11406/eta
```
You can use `all` as special value for `route` parameter.

## Text to speech
Proxy request to AWS Polly
```
curl -X POST \
  http://localhost:3000/tts \
  -H 'Content-Type: application/json' \
  -d '{
  "voiceId": "Kimberly",
  "text": "Test text"
}'
```
Response - url path to file with voice
```
/static/test_text_63303ae23c1badfe3a4adfd48ac5b813.mp3
```
So you can get it by concatenating host + path
```
http://localhost:3000/static/test_text_63303ae23c1badfe3a4adfd48ac5b813.mp3
```
Find all available Polly voices in [polly documentation](http://docs.aws.amazon.com/polly/latest/dg/API_Voice.html#API_Voice_Contents).

## TTS NJTransit schedule
Combines the 1st and 2nd endpoints
```
curl -X GET http://localhost:3000/route/158/stop/11406/voice/Kimberly/tts
```
Response - url path to file with voice
```
/static/there_is_not_schedule_for_bus_17817bea2e6b3adb256fe5b19af98f1f.mp3
```
