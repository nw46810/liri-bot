var fs = require('fs');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdb = require('omdb');
var request = require('request');
var input1 = process.argv[2];
var input2 = process.argv.splice(3).join(" ");
var keys = require('./keys.js');


// logging function
function log() {

    fs.appendFile('./log.txt', input1 + " " + input2 + ", ", function(err) {

        if (err) {
            console.log(err);
        }
        else {
            // console.log("logged!");
        }

    });
};

//credential retrival
var twit = new twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

var params = {
    screen_name: 'obinickenobi125',
    count: 20
};

run();

function run() {

    if (input1 === "my-tweets") {

        twit.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log('');
                console.log('My Last 20 Tweets: ');
                console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                tweets.forEach(function(individualTweet) {
                    console.log('Time Posted: ' + individualTweet.created_at);
                    console.log('Tweet: ' + individualTweet.text);
                    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                });

            } else {
                console.log(error);
            };
        });

        log();

    } else if (input1 === "spotify-this-song") {

        spotify.search({ type:'track', query: input2 }, function(err, data) {
		if (err) {
	    	return console.log(err);
	  	}
	  	var obj = data.tracks.items[0];

	 	console.log("****************************************");
		console.log("Artist: " + obj.artists[0].name);
		console.log("Song: " + obj.name);
		console.log("Preview URL: " + obj.preview_url);
		console.log("Album: " + obj.album.name);
		console.log("****************************************");
	});
        log();

    } else if (input1 === "movie-this") {

        if (input2.length < 1) {

            input2 = "Mr. Nobody";
        };

        request("http://www.omdbapi.com/?apikey=40e9cece&t=" + input2 + 
        	"&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                console.log('');
                console.log('OMDB Movie Information: ');
                console.log('--------------------------------------------');
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Country produced in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actor(s): " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
                console.log('--------------------------------------------');
            } else {

                console.log(error);

            }


        });

        log();

    } else if (input1 === "do-what-it-says") {

        log();

        fs.readFile('random.txt', 'utf8', function(err, data) {
            if (err) throw err;
            // console.log(data);

            var arr = data.split(',');

            input1 = arr[0].trim();
            input2 = arr[1].trim();
            run();

        });

    }
};