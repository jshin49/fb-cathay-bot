
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
                "name": "Farbound Smith Jr",
                "ticket_number": "0741234567890",
                "passenger_id": "p001"
              },
              {
                "name": "Nick Jones",
                "ticket_number": "0741234567891",
                "passenger_id": "p002"
              }
            ],
            "flight_info": [
              {
                "connection_id": "c001",
                "segment_id": "s001",
                "flight_number": "KL9123",
                "aircraft_type": "Boeing 737",
                "departure_airport": {
                  "airport_code": "SFO",
                  "city": "San Francisco",
                  "terminal": "T4",
                  "gate": "G8"
                },
                "arrival_airport": {
                  "airport_code": "SLC",
                  "city": "Salt Lake City",
                  "terminal": "T4",
                  "gate": "G8"
                },
                "flight_schedule": {
                  "departure_time": "2016-01-02T19:45",
                  "arrival_time": "2016-01-02T21:20"
                },
                "travel_class": "business"
              },
              {
                "connection_id": "c002",
                "segment_id": "s002",
                "flight_number": "KL321",
                "aircraft_type": "Boeing 747-200",
                "travel_class": "business",
                "departure_airport": {
                  "airport_code": "SLC",
                  "city": "Salt Lake City",
                  "terminal": "T1",
                  "gate": "G33"
                },
                "arrival_airport": {
                  "airport_code": "AMS",
                  "city": "Amsterdam",
                  "terminal": "T1",
                  "gate": "G33"
                },
                "flight_schedule": {
                  "departure_time": "2016-01-02T22:45",
                  "arrival_time": "2016-01-03T17:20"
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
            "price_info": [
              {
                "title": "Fuel surcharge",
                "amount": "1597",
                "currency": "USD"
              }
            ],
            "base_price": "12206",
            "tax": "200",
            "total_price": "14003",
            "currency": "USD"
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
            "intro_message": "Check-in is available now.",
            "locale": "en_US",
            "theme_color": "#006566",
            "pnr_number": "ABCDEF",
            "flight_info": [
              {
                "flight_number": "f001",
                "departure_airport": {
                  "airport_code": "SFO",
                  "city": "San Francisco",
                  "terminal": "T4",
                  "gate": "G8"
                },
                "arrival_airport": {
                  "airport_code": "SEA",
                  "city": "Seattle",
                  "terminal": "T4",
                  "gate": "G8"
                },
                "flight_schedule": {
                  "boarding_time": "2016-01-05T15:05",
                  "departure_time": "2016-01-05T15:45",
                  "arrival_time": "2016-01-05T17:30"
                }
              }
            ],
            "checkin_url": "https:\/\/8d754e51.ngrok.io\/checkin"
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
            "intro_message": "You are checked in.",
            "locale": "en_US",
            "theme_color": "#006566",
            "boarding_pass": [
              {
                "passenger_name": "SMITH\/NICOLAS",
                "pnr_number": "CG4X7U",
                "travel_class": "business",
                "seat": "74J",
                "auxiliary_fields": [
                  {
                    "label": "Terminal",
                    "value": "T1"
                  },
                  {
                    "label": "Departure",
                    "value": "30OCT 19:05"
                  }
                ],
                "secondary_fields": [
                  {
                    "label": "Boarding",
                    "value": "18:30"
                  },
                  {
                    "label": "Gate",
                    "value": "D57"
                  },
                  {
                    "label": "Seat",
                    "value": "74J"
                  },
                  {
                    "label": "Sec.Nr.",
                    "value": "003"
                  }
                ],
                "logo_image_url": "https:\/\/2441267d.ngrok.io\/static\/images\/logo.png",
                "header_image_url": "https:\/\/www.example.com\/en\/fb\/header.png",
                "qr_code": "M1SMITH\/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh",
                "above_bar_code_image_url": "https:\/\/www.example.com\/en\/PLAT.png",
                "flight_info": {
                  "flight_number": "KL0642",
                  "departure_airport": {
                    "airport_code": "JFK",
                    "city": "New York",
                    "terminal": "T1",
                    "gate": "D57"
                  },
                  "arrival_airport": {
                    "airport_code": "AMS",
                    "city": "Amsterdam"
                  },
                  "flight_schedule": {
                    "departure_time": "2016-01-02T19:05",
                    "arrival_time": "2016-01-05T17:30"
                  }
                }
              },
              {
                "passenger_name": "JONES\/FARBOUND",
                "pnr_number": "CG4X7U",
                "travel_class": "business",
                "seat": "74K",
                "auxiliary_fields": [
                  {
                    "label": "Terminal",
                    "value": "T1"
                  },
                  {
                    "label": "Departure",
                    "value": "30OCT 19:05"
                  }
                ],
                "secondary_fields": [
                  {
                    "label": "Boarding",
                    "value": "18:30"
                  },
                  {
                    "label": "Gate",
                    "value": "D57"
                  },
                  {
                    "label": "Seat",
                    "value": "74K"
                  },
                  {
                    "label": "Sec.Nr.",
                    "value": "004"
                  }
                ],
                "logo_image_url": "https:\/\/2441267d.ngrok.io\/static\/images\/logo.png",
                "header_image_url": "https:\/\/www.example.com\/en\/fb\/header.png",
                "qr_code": "M1JONES\/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh",
                "above_bar_code_image_url": "https:\/\/www.example.com\/en\/PLAT.png",
                "flight_info": {
                  "flight_number": "KL0642",
                  "departure_airport": {
                    "airport_code": "JFK",
                    "city": "New York",
                    "terminal": "T1",
                    "gate": "D57"
                  },
                  "arrival_airport": {
                    "airport_code": "AMS",
                    "city": "Amsterdam"
                  },
                  "flight_schedule": {
                    "departure_time": "2016-01-02T19:05",
                    "arrival_time": "2016-01-05T17:30"
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
            "intro_message": "Your flight is delayed",
            "update_type": "delay",
            "locale": "en_US",
            "theme_color": "#006566",
            "pnr_number": "CF23G2",
            "update_flight_info": {
              "flight_number": "KL123",
              "departure_airport": {
                "airport_code": "SFO",
                "city": "San Francisco",
                "terminal": "T4",
                "gate": "G8"
              },
              "arrival_airport": {
                "airport_code": "AMS",
                "city": "Amsterdam",
                "terminal": "T4",
                "gate": "G8"
              },
              "flight_schedule": {
                "boarding_time": "2015-12-26T10:30",
                "departure_time": "2015-12-26T11:30",
                "arrival_time": "2015-12-27T07:30"
              }
            }
          }
        }
      }
    };

  },

};
