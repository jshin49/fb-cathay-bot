/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
'use strict';

const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  https = require('https'),
  request = require('request'),
  unirest = require('unirest'),
  jsonfile = require('jsonfile'),
  fs = require('fs');

var util = require('./utility_module.js');
var apiai = require("./api-ai.js");
var preflight = require('./preflight.js');
var postflight = require('./postflight.js');

var app = express();

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json({ verify: verifyRequestSignature }));
// app.use(express.static('public'));
// app.use('/sessions', express.static('sessions'));
app.use('/static', express.static('static'));
app.use('/assets', express.static('static/pages/assets'));
app.use('/booking', express.static('static/pages/index.html'));
app.use('/checkin', express.static('static/pages/check-in.html'));


/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 *
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET =
  (process.env.APP_SECRET) ?
  process.env.APP_SECRET :
  config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN =
  (process.env.VALIDATION_TOKEN) ?
  (process.env.VALIDATION_TOKEN) :
  config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN =
  (process.env.PAGE_ACCESS_TOKEN) ?
  (process.env.PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// Get Facebook page ID to check the sender
const PAGE_ID =
  (process.env.PAGE_ID) ?
  (process.env.PAGE_ID) :
  config.get('pageID');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN)) {
  console.error("Missing config values");
  process.exit(1);
}

/*
 * For Cathay Pacific Hackathon 2016 
 * Demo and testing purpose
 * Change these values to your values you want to test with
 */

// var currentTestUser = "YOUR MID"
// var currentUser = "USER NAME";
// Use change these values to run through your own demo

var testUser = "YOUR MID"; // e,g. 12361668181819;
var currentTestUser = testUser;
var currentUser = "Your Name";

const contexts = [
  'pre_flight',
  'in_flight',
  'post_flight'
];

// Store current context - Change to session data or database if possible
var current_context = contexts[0];
var checked_in = false;

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function(req, res) {
  console.log(VALIDATION_TOKEN);
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  }

  // Strictly for Demo Purposes. Pre-flight Booking and Check-In
  else if (req.query['booking'] === 'done' && req.query['verify_token'] === VALIDATION_TOKEN) {
    console.log("received booking confirmation");
    sendTextMessage(currentTestUser, "Hi " + currentUser + ", this is Cathy, your personal flight assistant. We're excited to have you on board with us soon. :)")
    // sender action
    callSendAPI({
      "recipient":{
        "id":currentTestUser
      },
      "sender_action":"typing_on"
    });
    setTimeout(() => {
      callSendAPI(preflight.sendItinerary(currentTestUser));
      setTimeout(() => {
        callSendAPI(preflight.sendCheckIn(currentTestUser));
      }, 3000);
    }, 2000);

  }

  else if (checked_in == false && req.query['checkin'] === 'done' && req.query['verify_token'] === VALIDATION_TOKEN) {
    checked_in = true;

    // Changed context to pre_board from pre_flight
    // current_context = contexts[2];

    console.log("received checkin confirmation");

    // sender action
    callSendAPI({
      "recipient":{
        "id":currentTestUser
      },
      "sender_action":"typing_on"
    });
    setTimeout(() => {
      callSendAPI(preflight.sendBoardingPass(currentTestUser));

      setTimeout(() => {
        if (!flight_status_duplicate) {
          callSendAPI(preflight.sendFlightUpdate(currentTestUser));
          setTimeout(() => {
            // Changed context to in_flight from pre_board
            current_context = contexts[1];
            callSendAPI(preflight.sendStartFlight(currentTestUser));
            
            setTimeout(() => {
              // Changed context to post_flight from in_flight
              // current_context = contexts[2];
              callSendAPI(preflight.sendEndFlight(currentTestUser));


              postflight.fetchLocalRestaurants((restaurant) => { 
                console.log(restaurant);

                postflight.fetchLocalWeatherData('Hong Kong', (weather) => { 
                  console.log(weather);

                  var postFlightData = {
                    recipient: {
                      id: currentTestUser
                    },
                    message: {
                      attachment: {
                        type: "template",
                        payload: {
                          template_type: "generic",
                          elements: [{
                            title: restaurant.name,
                            subtitle: "Here's a restaurant near you with the best reviews",
                            item_url: restaurant.url,
                            image_url: restaurant.photo,
                            buttons: [{
                              type: "web_url",
                              url: restaurant.url,
                              title: "View Map"
                            }],
                          }, {
                            title: "Weather: " + weather.temp + "\u2103 " + weather.main, 
                            subtitle: "Currently " + weather.description + " in Hong Kong.",
                            item_url: "http://www.weather.gov.hk/m/home.htm",
                            image_url: "http://www.weather.gov.hk/content_elements_v2/images/weather-icon-120x120/pic53.png",
                            buttons: [{
                              type: "web_url",
                              url: "http://www.weather.gov.hk/m/home.htm",
                              title: "View Details"
                            }]
                          }]
                        }
                      }
                    }
                  };

                  callSendAPI(postFlightData);
                });
              });

              // current_context = contexts[0];
            }, 20000);
          }, 30000);
        }
        
      }, 4000);   
    }, 2000); 

  }
  else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/implementation#subscribe_app_pages
 *
 */
app.post('/webhook', function (req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object == 'page') {
    console.log(data.entry);
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {

          // send to API.ai for NLP, and callback is redirected to with response receivedMessage
          if (messagingEvent.sender.id != PAGE_ID){
            apiai.sendRequest(messagingEvent.sender.id, current_context, messagingEvent.message.text, (res, err) => {
              if (err != null) {
                receivedMessage(messagingEvent, null, err);
              }
              if (res != null) {
                receivedMessage(messagingEvent, res.speechResponse, null);                
              }
              else {
                receivedMessage(messagingEvent, null, null);                
              }
            });
          }

        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];
  console.log(signature);
  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference#auth
 *
 */
function receivedAuthentication(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  if (senderID == PAGE_ID) {
    console.error("Sender is self.");
    return;
  }
  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger'
  // plugin.
  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam,
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  sendTextMessage(senderID, "Authorizationentication successful");
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference#received_message
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage(event, speechIntent, error) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  // process the intent here
  var intent = null;

  if (senderID == PAGE_ID) {
    console.error("Sender is self.");
    return;
  }

  // API.ai outputted an error, NLP processing went wrong
  if (error != null || speechIntent == null) {
    sendTextMessage(senderID, "Sorry, I couldn't understand your message");
  }

  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'Help':
      case 'help':
        if (current_context == contexts[1]) {
          sendTextMessage(senderID, "Request accepted. Our cabin crew will serve you shortly.");
        }
        else {
          sendTextMessage(senderID, "How may I help you? You can click to refer to the menu, on the left of your text box.");
        }
        break;
      default:
        // sender action
        callSendAPI({
          "recipient":{
            "id":currentTestUser
          },
          "sender_action":"typing_on"
        });
        sendTextMessage(senderID, speechIntent); // All requests are handled from API.ai
        break;
    }
  }
  else if (messageAttachments) {
    console.log("No matching attachment type");
    sendTextMessage(senderID, "Message with no matching attachment type received.");
  }
}


/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference#message_delivery
 *
 */
function receivedDeliveryConfirmation(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var delivery = event.delivery;
  var messageIDs = delivery.mids;
  var watermark = delivery.watermark;
  var sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      console.log("Received delivery confirmation for message ID: %s", messageID);
    });
  }

  console.log("All message before %d were delivered.", watermark);
}


/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. Read
 * more at https://developers.facebook.com/docs/messenger-platform/webhook-reference#postback
 *
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  if (senderID == PAGE_ID) {
    console.error("Sender is self.");
    return;
  }

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  switch (payload) {
    case 'PERSISTENT_MENU_CALL_CABIN_CREW':
      if (current_context == contexts[2]) {
        sendTextMessage(senderID, "Request accepted. Our cabin crew will serve you shortly.");
      }
      else {
        sendTextMessage(senderID, "We know you're not in-flight right now ;)");
      }
      break;

    case 'PERSISTENT_MENU_CHECK_IN':
      // if (current_context == contexts[0]) {
      callSendAPI(preflight.sendCheckIn(currentTestUser));
      // }
      // else {
        // sendTextMessage(senderID, "Sorry " + currentUser + ", you already checked-in.");
      // }
      break;

    case 'PERSISTENT_MENU_BOARDING_PASS':
      if (checked_in) {
        callSendAPI(preflight.sendBoardingPass(currentTestUser));        
      }
      else {
        sendTextMessage(senderID, "Sorry " + currentUser + ", you need to check-in first.");
      }
      break;

    case 'PERSISTENT_MENU_FLIGHT_STATUS':
      if (current_context == contexts[2]) {
        sendTextMessage(senderID, "Currently we are above the Pacific Ocean. You have 6 hours of flight time left.");
      }
      else {
        callSendAPI(preflight.sendFlightUpdate(currentTestUser));
      }
      break;

    case 'PERSISTENT_MENU_POST_FLIGHT':
      sendTextMessage(senderID, "Here are some useful informations regarding your destination :)");
      break;

    default:
      // When a postback is called, we'll send a message back to the sender to
      // let them know it was successful
      console.log("Postback called");
      sendTextMessage(senderID, "Please type 'Help' or open the menu.");
      break;
  }
}


/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId, messageText, buttons) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: messageText,
          buttons: buttons
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}


/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId) {
  // Example Data
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message. Trying again.");
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;

          console.log("Successfully sent generic message with id %s to recipient %s",
            messageId, recipientId);
        } else {
          console.error("Unable to send message.");
          // console.error(response);
          console.error(error);
        }
      });
      // console.error(response);
      console.error(error);
    }
  });
}

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), function() {
  console.log('Cathay Bot is running on port', app.get('port'));
});

module.exports = app;
