require("dotenv").config();

var userInput = process.argv[2];
var processInput = process.argv;
var userQuery = "";
var logInfo = "";

for (var i = 3; i < processInput.length; i++) {
  userQuery += processInput[i] + " ";
}

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

getAction();

function getAction() {
  if (userInput === "spotify-this-song" && userQuery === "") {
    userQuery = "The Sign Ace of Base";
  } else if (userInput === "movie-this" && userQuery === "") {
    userQuery = "Mr. Nobody";
  }
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
}

function readFile() {
  // Running the readFile module that's inside of fs.
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    output = data.split(",");

    userInput = output[0];
    userQuery = output[1];

    getAction();
  });
}

function twitterGo() {
  //run get on twitter
  var params = { screen_name: "bbd_8_" };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    //make sure it only goes if there's no error
    if (!error) {
      console.log("Here are your last 20 tweets, my dude:");
      console.log(" ");
      //This loop ensures that only 20 results are shwon
      for (var i = 0; i < 19; i++) {
        var tweetText = JSON.stringify(tweets[i].text);
        var tweetCreated = JSON.stringify(tweets[i].created_at);
        console.log("Your tweet on " + tweetCreated + " said, " + tweetText);
        console.log(" ");
        logInfo = tweetCreated + ", " + tweetText;
        log();
      }
    }
  });
}

function spotifyGo() {
  //this searches spotify api
  spotify.search({ type: "track", query: userQuery }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err); //this lets us know if there was an error
    }

    //this sets all the data to variables so they are easier to manipuate
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
    logInfo = upperName + ", " + songName + "," + previewURL + ", " + albumName;
    log();
  });
}

function omdbGo() {
  // Then run a request to the OMDB API with the user query or default
  var queryUrl =
    "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      var title = JSON.parse(body).Title;

      if (title === undefined) {
        console.log(
          "I didn't understand that. Please enter the title correctly this time."
        );
        return;
      }
      //log the information
      console.log(" ");
      console.log("Here's what I found about your movie:");
      console.log(" ");
      console.log("Title: " + JSON.parse(body).Title);
      console.log(" ");
      console.log("Year: " + JSON.parse(body).Year);
      console.log(" ");
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log(" ");
      console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
      console.log(" ");
      console.log("Country Produced: " + JSON.parse(body).Country);
      console.log(" ");
      console.log("Language: " + JSON.parse(body).Language);
      console.log(" ");
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log(" ");
      console.log("Actors: " + JSON.parse(body).Actors);
      logInfo =
        JSON.parse(body).Title +
        ", " +
        JSON.parse(body).Year +
        ", " +
        JSON.parse(body).imdbRating +
        " ," +
        JSON.parse(body).Ratings[1].Value +
        ", " +
        JSON.parse(body).Country +
        ", " +
        JSON.parse(body).Language +
        ", " +
        JSON.parse(body).Plot +
        ", " +
        JSON.parse(body).Actors;
      log();
    }
  });
}

function log() {
  fs.appendFile("log.txt", logInfo, function(err) {
    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return console.log(err);
    }
  });
}
