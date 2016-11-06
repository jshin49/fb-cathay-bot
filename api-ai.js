// SAMPLE USAGE
// var api-ai = require("./api-ai.js");

// api-ai.sendRequest("some_session_id_as_hash_string","pre_order","I want to book a flight", function(response, err) {
//   if (err) {
//     return;
//   }
//   console.log(response);
// });

var config = require("config");

// Get API.ai key from config
const APIAI =
  (process.env.APIAI) ?
  (process.env.APIAI) :
  config.get('apiAiKey');

var apiai = require("apiai")(APIAI);

module.exports.sendRequest = function(session_id, context, request_text, callback) {
  var request = apiai.textRequest(request_text, {contexts:[{"name":context,"lifespan":1}], sessionId:session_id});

  request.on("response", function(response) {
    // console.log(response);
    var next_action = response.result.action;
    var next_context = context;

    if (response.result.action=="smalltalk.unknown") {
      console.log("FAIL: nlp recognition failure");
      next_action = null;
    } else if (response.result.action=="input.unknown"){
      next_action = null;
    }

    var simplifiedResponse = {"session_id":session_id, "next_context":next_context, "action":next_action,"parameters":response.result.parameters, "speechResponse":response.result.fulfillment.speech};
    //console.log(simplifiedResponse);
    callback(simplifiedResponse, null);
  });
  request.on("error", function(err) {
    console.log("ERROR: nlp request failed");
    callback(null, err);
  });
  request.end();

}
