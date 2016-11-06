# fb-cathay-bot
Cathy - Cathay Pacific Facebook Messenger Bot that provides Customer Journey at eas.

The demo sequence starts by first finishing the booking.

First, set up the message ID and your name in lines 86~88 of app.js, and all the configs in config/default.json

Second, in static/pages/booking.html and check-in.html, change the URLs to your APP SERVER URL serving these pages, and the redirect URL to your PAGE_ID.

Then, open the web page in static/pages/booking.html, and click on Confirm Booking.

The Cathy bot will send a message to your MID directly, with a Booking Confirmation along with a structured Travel Itinerary.

A few seconds later, you will be prompted to check-in online, and by clicking check-in you will be redirected to check-in.html

After confirming check-in, you will be prompted with a Boarding Pass by Messenger.

Around 30 seconds later, you will be considered on-flight, and you can start ordering menu catering services, or ask for help.

Finally, another 30 seconds later, you will be simulated as post-flight, and you will receive some informations about HKG International Airport by default (you can change this to a location of your preference)


Features of this bot is as the following:

1. Pre-flight
	- Ticket Confirmation
	- Receive Itinerary
	- Online Check-in
	- Receive Boarding Pass
	- Receive Real-time Flight Status Updates

2. In-flight
 	- Menu Ordering
 	- Call Flight Cabin Crew

3. Post-flight
	- Destination Weather Information
	- Destination Restaurant Information

4. General FAQs

First, check out the [Quickstart Guide](https://developers.facebook.com/docs/messenger-platform/quickstart) provided by Facebook.

Second, mkdir config and add a default.json inside config with the following contents:

```javascript
{
	"herokuBaseURL": "YOUR HEROKU URL WITH TRAILING SLASH"",
	"ngrokBaseURL": "YOUR NGROK URL WITH TRAILING SLASH"",
	"apiAiKey": "YOUR API.ai API KEY",
	"weatherApiKey": "YOUR OPEN WEATHER API KEY from openweathermap.org/api",
	"googleMapKey": "YOUR GOOGLE MAP API KEY",
  "appID": "YOUR APP ID",
 	"pageID": "YOUR PAGE ID",
  "appSecret": "YOUR APP SECRET",
  "pageAccessToken": "YOUR PAGEACCESS TOKEN",
  "validationToken": "YOUR OWN TOKEN" (by default, "just_do_it")
}
```

## Running Locally or on AWS
0. Install Node.js, NPM, and [ngrok](https://ngrok.com/) (or [localtunnel](https://localtunnel.me/))
1. Run "sudo npm install" command to install external modules locally
2. Run "node app.js" to run the app
3. Enter localhost:8080 on the web url to check (All static files are served in the 'public' folder)
4. Enter ngrok http 8080 to tunnel a connection from https://foo.ngrok.io to localhost
5. Give https://foo.ngrok.io/webhook for your webhook verificaiton URL in the Messenger App settings
6. Now for every message, you can check the response and request through your console.

## Running on Heroku
0. Do steps 0~1 from above and install Heroku toolbelt from the Heroku website
1. Run "heroku login"
2. If existing repository, simply add a remote to heroku with this command: heroku git:remote -a YOUR_HEROKU_APP
3. Else, run the following codes

  - heroku git:clone -a fb-cathay-bot && cd fb-cathay-bot
  - git add . && git commit -am "make it better" && git push heroku master

4. Give https://yourheroku.herokuapp.com/webhook for your webhook verificaiton URL in the Messenger App settings
5. Voila :)
6. Alternatively, you can connect your herokuapp to GitHub, and set it to automatically deploy whenever a commit is made.

Or you can simply click

@TODO: (Will add deploy to heroku button here later)