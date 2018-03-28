require("dotenv").config();

var userInput = process.argv[2];
var processInput = process.argv;
var userQuery = "";

for (var i = 3; i < processInput.length; i++) {
  userQuery += processInput[i] + " ";
}

console.log(userQuery);

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var params = { screen_name: "benjamindally" };

if (userInput === "spotify-this-song") {
  spotifyGo();
} else if (userInput === "my-tweets") {
  twitterGo();
} else if (userInput === "movie-this") {
  omdbGo();
} else if (userInput === "do-what-it-says") {
  readFile();
} else if (userInput === undefined) {
  console.log(
    "Do you need a list of commands? Try entering 'my-tweets', 'spotify-this-song', 'movie-this', or 'do-what-it-says'. Or don't, you do you, fam."
  );
}

function twitterGo() {
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log("Here are your last 20 tweets, my dude:");
      console.log(" ");
      for (var i = 0; i < 19; i++) {
        var tweetText = JSON.stringify(tweets[i].text);
        var tweetCreated = JSON.stringify(tweets[i].created_at);
        console.log("Your tweet on " + tweetCreated + " said, " + tweetText);
        console.log(" ");
      }
    }
  });
}

function spotifyGo() {
  if (userQuery === undefined) {
    userQuery = "The Sign";
  }

  spotify.search({ type: "track", query: userQuery }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    var lowerName = data.tracks.items[0].artists[0].name;
    var upperName = lowerName.charAt(0).toUpperCase() + lowerName.substring(1);
    var albumName = data.tracks.items[0].album.name;
    var songName = data.tracks.items[0].name;
    var previewURL = data.tracks.items[0].external_urls.spotify;
    console.log(" ");
    console.log("Here's what I found about your song:");
    console.log(" ");
    console.log("Artist: " + upperName);
    console.log(" ");
    console.log("Song Name: " + songName);
    console.log(" ");
    console.log("Check it out: " + previewURL);
    console.log(" ");
    console.log("Album: " + albumName);
  });
}
