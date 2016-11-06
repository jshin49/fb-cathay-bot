var config = require("config");

// Get Heroku Base URL
const HEROKU =
  (process.env.HEROKU) ?
  (process.env.HEROKU) :
  config.get('herokuBaseURL');

// Get ngrok Base URL
const NGROK =
  (process.env.NGROK) ?
  (process.env.NGROK) :
  config.get('ngrokBaseURL');

const BASEURL = 
  (HEROKU == "") ?
  HEROKU :
  NGROK;

module.exports = {

  sendItinerary : function(recipientId) {
      
    return {
      "recipient": {
        "id": recipientId
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "airline_itinerary",
            "intro_message": "Here\'s your flight itinerary.",
            "locale": "en_US",
            "theme_color": "#006566",
            "pnr_number": "ABCDEF",
            "passenger_info": [
              {
                "name": "Jin Jang",
                "ticket_number": "0741234567890",
                "passenger_id": "p001"
              },
              {
                "name": "Clara Jang",
                "ticket_number": "0741234567891",
                "passenger_id": "p002"
              }
            ],
            "flight_info": [
              {
                "connection_id": "c001",
                "segment_id": "s001",
                "flight_number": "CX871",
                "aircraft_type": "Boeing 777",
                "departure_airport": {
                  "airport_code": "HKG",
                  "city": "Hong Kong",
                  "terminal": "1"
                },
                "arrival_airport": {
                  "airport_code": "SFO",
                  "city": "San Francisco",
                  "terminal": "T4"
                },
                "flight_schedule": {
                  "departure_time": "2016-10-23T11:50",
                  "arrival_time": "2016-10-23T14:15"
                },
                "travel_class": "business"
              },
              {
                "connection_id": "c002",
                "segment_id": "s002",
                "flight_number": "KL321",
                "aircraft_type": "Boeing 777-200",
                "travel_class": "business",
                "departure_airport": {
                  "airport_code": "SFO",
                  "city": "San Francisco",
                  "terminal": "T4"
                },
                "arrival_airport": {
                  "airport_code": "HKG",
                  "city": "Hong Kong",
                  "terminal": "1"
                },
                "flight_schedule": {
                  "departure_time": "2016-10-30T11:50",
                  "arrival_time": "2016-10-30T14:15"
                }
              }
            ],
            "passenger_segment_info": [
              {
                "segment_id": "s001",
                "passenger_id": "p001",
                "seat": "12A",
                "seat_type": "Business"
              },
              {
                "segment_id": "s001",
                "passenger_id": "p002",
                "seat": "12B",
                "seat_type": "Business"
              },
              {
                "segment_id": "s002",
                "passenger_id": "p001",
                "seat": "73A",
                "seat_type": "World Business",
                "product_info": [
                  {
                    "title": "Lounge",
                    "value": "Complimentary lounge access"
                  },
                  {
                    "title": "Baggage",
                    "value": "1 extra bag 50lbs"
                  }
                ]
              },
              {
                "segment_id": "s002",
                "passenger_id": "p002",
                "seat": "73B",
                "seat_type": "World Business",
                "product_info": [
                  {
                    "title": "Lounge",
                    "value": "Complimentary lounge access"
                  },
                  {
                    "title": "Baggage",
                    "value": "1 extra bag 50lbs"
                  }
                ]
              }
            ],
            "base_price": "5250",
            "tax": "808",
            "total_price": "6058",
            "currency": "HKD"
          }
        }
      }
    };

  },

  sendCheckIn : function(recipientId) {
    
    return {
      "recipient": {
          "id": recipientId
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "airline_checkin",
            "intro_message": "Check-in counter is now open. Come pick up your boarding pass! Online check-in will save your time.",
            "locale": "en_US",
            "theme_color": "#006566",
            "pnr_number": "ABCDEF",
            "flight_info": [
              {
                "flight_number": "f001",
                "departure_airport": {
                  "airport_code": "HKG",
                  "city": "Hong Kong",
                  "terminal": "1"
                },
                "arrival_airport": {
                  "airport_code": "SFO",
                  "city": "San Francisco",
                  "terminal": "T4"
                },
                "flight_schedule": {
                  "boarding_time": "2016-10-23T13:45",
                  "departure_time": "2016-10-23T14:15",
                  "arrival_time": "2016-10-23T11:50"
                }
              }
            ],
            "checkin_url": BASEURL+"checkin"
          }
        }
      }
    };

  },

  sendBoardingPass : function(recipientId) {

    return {
      "recipient": {
        "id": recipientId
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "airline_boardingpass",
            "intro_message": "Here is your boarding pass! Show it to our cabin crew to get on board.",
            "locale": "en_US",
            "theme_color": "#006566",
            "boarding_pass": [
              {
                "passenger_name": "JANG\/JIN",
                "pnr_number": "CG4X7U",
                "travel_class": "business",
                "seat": "12A",
                "auxiliary_fields": [
                  {
                    "label": "Terminal",
                    "value": "1"
                  },
                  {
                    "label": "Departure",
                    "value": "23OCT 14:15"
                  }
                ],
                "secondary_fields": [
                  {
                    "label": "Boarding",
                    "value": "13:45"
                  },
                  {
                    "label": "Gate",
                    "value": "11"
                  },
                  {
                    "label": "Seat",
                    "value": "12A"
                  },
                  {
                    "label": "Sec.Nr.",
                    "value": "003"
                  }
                ],
                "logo_image_url": BASEURL+"static\/images\/logo.png",
                // "header_image_url": "https:\/\/15ca5f98.ngrok.io\/static\/images\/logo.png",
                "qr_code": "M1SMITH\/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh",
                // "above_bar_code_image_url": "https:\/\/15ca5f98.ngrok.io\/static\/images\/logo.png",
                "flight_info": {
                  "flight_number": "CX871",
                  "departure_airport": {
                    "airport_code": "HKG",
                    "city": "Hong Kong",
                    "terminal": "1",
                    "gate": "11"
                  },
                  "arrival_airport": {
                    "airport_code": "SFO",
                    "city": "San Francisco",
                    "terminal": "T4"
                  },
                  "flight_schedule": {
                    "departure_time": "2016-10-23T14:15",
                    "arrival_time": "2016-10-23T11:50"
                  }
                }
              },
              {
                "passenger_name": "JANG\/CLARA",
                "pnr_number": "CG4X7U",
                "travel_class": "business",
                "seat": "12B",
                "auxiliary_fields": [
                  {
                    "label": "Terminal",
                    "value": "1"
                  },
                  {
                    "label": "Departure",
                    "value": "23OCT 14:15"
                  }
                ],
                "secondary_fields": [
                  {
                    "label": "Boarding",
                    "value": "13:45"
                  },
                  {
                    "label": "Gate",
                    "value": "11"
                  },
                  {
                    "label": "Seat",
                    "value": "12B"
                  },
                  {
                    "label": "Sec.Nr.",
                    "value": "004"
                  }
                ],
                "logo_image_url": BASEURL+"static\/images\/logo.png",
                // "header_image_url": "https:\/\/15ca5f98.ngrok.io\/static\/images\/logo.png",
                "qr_code": "M1JONES\/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh",
                // "above_bar_code_image_url": "https:\/\/15ca5f98.ngrok.io\/static\/images\/logo.png",
                "flight_info": {
                  "flight_number": "CX871",
                  "departure_airport": {
                    "airport_code": "HKG",
                    "city": "Hong Kong",
                    "terminal": "1",
                    "gate": "11"
                  },
                  "arrival_airport": {
                    "airport_code": "SFO",
                    "city": "San Francisco",
                    "terminal": "T4"
                  },
                  "flight_schedule": {
                    "departure_time": "2016-10-23T14:15",
                    "arrival_time": "2016-10-23T11:50"
                  }
                }
              }
            ]
          }
        }
      }
    };

  },

  sendFlightUpdate : function(recipientId) {

    return {
      "recipient": {
        "id": recipientId
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "airline_update",
            "intro_message": "Your flight has been delayed, and we are terribly sorry for your extra wait. Keep attentive to any announcements being made just in case your boarding gate could change.",
            "update_type": "delay",
            "locale": "en_US",
            "theme_color": "#006566",
            "pnr_number": "CF23G2",
            "update_flight_info": {
              "flight_number": "CX871",
              "departure_airport": {
                "airport_code": "HKG",
                "city": "Hong Kong",
                "terminal": "1",
                "gate": "11"
              },
              "arrival_airport": {
                "airport_code": "SFO",
                "city": "San Francisco",
                "terminal": "T4",
                "gate": "G8"
              },
              "flight_schedule": {
                "boarding_time": "2015-12-26T15:45",
                "departure_time": "2015-12-26T16:15",
                "arrival_time": "2015-12-27T13:50"
              }
            }
          }
        }
      }
    };

  },

  sendStartFlight : function(recipientId) {

    return {
      "recipient": {
        "id": recipientId
      },
      "message": {
        "text": "Thank you for boarding CX871! Please do not hesitate to reach out to me once we are in air! :)"
      }
    };

  },  

  sendEndFlight : function(recipientId) {

    return {
      "recipient": {
        "id": recipientId
      },
      "message": {
        "text": "Thank you for using Cathay Pacific. Would you like to give us any feedbacks? Here are some information that might be useful for you at your destination point! :)"
      }
    };

  }

};