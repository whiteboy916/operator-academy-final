//  Send SMS While On A Phone Call
// Start with Node app.js


require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const voiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('/answer', (req, res) => {
  const caller = req.body.From;
  const twilioNumber = req.body.To;
  sendSms(caller, twilioNumber);

  const r = new voiceResponse();
  r.say('Thanks for calling! We just sent you a text with a clue.');
  res.send(r.toString());
});

function sendSms(caller, twilioNumber) {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  return client.messages.create({
    body: "boom operator academy gave me these tools.",
    from: twilioNumber,
    to: caller,
  }).then()
    .catch(function(error) {
      if (error.code === 21614) {
        console.log("Uh oh, looks like this caller can't receive SMS messages.")
      }
    })
    .done();
}

app.listen(3000, function(){
  console.log('Send SMS During Inbound Calls listening on port 3000!')
});

module.exports = app;
