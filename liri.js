//passing 3rd argument as action
var action = process.argv[2];

//creating loop for making any argument after action to be part of the search value
var nodeArgs = process.argv;
var value = "";
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    value = value + " " + nodeArgs[i];
  }
  else {
    value += nodeArgs[i];
  }
}

var doWhat = false;

//creating switch for each action argument
switch (action) {
  case "my-tweets":
    tweets(doWhat);
    break;

  case "spotify-this-song":
    spotify(value, doWhat); //pass value from arguments
    break;

  case "movie-this":
    movie(value, doWhat); //pass value from arguments
    break;

  case "do-what-it-says":
    random(doWhat);
    break;
  //validation for person trying a different action
  default:
  	console.log("Try a different action");
}

//twitter function
function tweets(doWhat) {
	var fs = require("fs");
	var Twitter = require('twitter'); //require twitter package
	var keys = require("./keys.js"); //require keys.js to read tokens
	var moment = require("moment"); //require moment package to get correct timestamp formatting
	var client = new Twitter({ //create new twitter client using keys.js tokens
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});
	// 'search/tweets'
	var params = {screen_name: 'davesrose16'}; //use my username
	client.get('statuses/user_timeline', params, function(error, tweets, response) { //get tweets from davesrose16
	  if (!error) {
	  	console.log(""); //first console log username and divider
	  	console.log("Tweets for davesrose16");
	  	console.log("-----------------------");
		var stream = fs.createWriteStream("log.txt",{'flags': 'a'});
		stream.once('open', function(fd) {
			if (doWhat === true) {
				doWhat = false;
			} else {
				stream.write("\n\n$ node liri.js my-tweets\n");
			}
			stream.write("\nTweets for davesrose16\n-----------------------");
	  	tweets.length <= 20; //set tweets length to latest 20
	  	for (var z = 0; z < tweets.length; z++) { //creating loop to display each tweet
	  		var timeStamp = moment(tweets[z].created_at, "ddd mmm HH:mm:ss Z yyyy").format("MM/DD/YYYY") //getting month, day and year from moment: can't get it to recognize twitter's hour format from this
	  		var hours = tweets[z].created_at; //getting entire twitter timestamp
	  		var hourStamp = hours.substr(11,14); //grabbing the HH:mm:ss +0000 in the timestamp
	  		hourStamp = moment(hourStamp, "HH:mm:ss ZZZZ").format("hh:mm A"); //moment will correctly format timezone time in this format
	  		console.log(timeStamp+" "+hourStamp+": '"+tweets[z].text+"'"); //display time and tweet text
	  		console.log("");

				stream.write("\n"+timeStamp+" "+hourStamp+": '"+tweets[z].text+"'\n");


		} //end for loop
				stream.end();
			});
	  } else {
	  	console.log(error); //if error, display it
	  }
	}); //end get response
} //end twitter function
//spotify function
function spotify(value, doWhat) {

	var fs = require("fs");

	if (doWhat === "") { //if the value that was passed is empty, make keywords be Ace of Base, The Sign
		doWhat = "The+Sign+Ace+of+Base";
	}

	var Spotify = require('node-spotify-api'); //require node-spotify-api package

	var spotify = new Spotify({ //set my api token
  		id: '5f9f6a12c68a49829e44158d7f7de197',
  		secret: '415c2f318c74469f907ec1927a123882'
	});

	spotify.search({ type: 'track', query: value, limit: 5 }, function(err, data, response) { //search track with value that's been passed to this function, and set limit to 5 entries
	  if (err) { //if error, console log it
	    return console.log('Error occurred: ' + err);
	  }

	var stream = fs.createWriteStream("log.txt",{'flags': 'a'});
	stream.once('open', function(fd) {
		if ((value !== "The+Sign+Ace+of+Base") && (doWhat === false)) {
			stream.write("\n\n$ node liri.js spotify-this-song "+value);
		} else if ((value !== "The+Sign+Ace+of+Base") && (doWhat === true)) {
			doWhat = false;
		} else if ((value === "The+Sign+Ace+of+Base") && (doWhat === false)) {
			stream.write("\n\n$ node liri.js spotify-this-song ");
		}
		stream.write("\n\n");

	  var tracks = data.tracks.items; //set track items
	  for (var w = 0; w < tracks.length; w++) { //make loop to go through each track item
	  	console.log(""); //format spaces
	  	console.log(" Track : "+parseInt(w+1)+" ----------------------"); //display track number
	  	console.log(" Artist Name: "+tracks[w].artists[0].name) //get and display artist name
	  	console.log(" Song Name: "+tracks[w].name);  //get and display song name
	  	console.log(" Song Url: "+tracks[w].external_urls.spotify) //get and display song url
	  	console.log(" Album Name: "+tracks[w].album.name) //get and display album name
	  	console.log("");
  		stream.write(" Track : "+parseInt(w+1)+" ----------------------\n");
  		stream.write(" Artist Name: "+tracks[w].artists[0].name+"\n");
  		stream.write(" Song Name: "+tracks[w].name+"\n");
  		stream.write(" Song Url: "+tracks[w].external_urls.spotify+"\n");
		stream.write(" Album Name: "+tracks[w].album.name+"\n");
		stream.write("\n");
			
	  }
		stream.end();
	});
	// console.log(JSON.stringify(data, null, 2)); 
	}); //end spotify search
} //end spotify function

function movie(value, doWhat) {

	var fs = require("fs");

	if (value === "") { //if value is empty, set it as Mr Nobody
		value = "Mr Nobody";
	}

	var request = require("request"); //require request package

	request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=40e9cece", function(error, response, body) { //use request to call omdb api

	  // If the request was successful...
	  if (!error && response.statusCode === 200) {
	  	var title = "Movie Title: "+JSON.parse(body).Title; //create movie title variable
	  	var year = "\nMovie Year: "+JSON.parse(body).Year;  //create movie year variable
	  	var imdb = "\nIMDB Rating: "+JSON.parse(body).imdbRating;  //create movie IMDB rating variable
	  	var country = "\nCountry: "+JSON.parse(body).Country; //create movie country variable
	  	var language = "\nLanguage: "+JSON.parse(body).Language; //create movie language variable
	  	var plot = "\nPlot: "+JSON.parse(body).Plot; //create movie plot variable
	  	var actors = "\nActors: "+JSON.parse(body).Actors; //create movie actors variable
	  	var rotten = JSON.parse(body).Ratings[1]; //create movie ratings variable
	  	if (rotten === undefined) { //if rotten tomatoes score is missing from the ratings array
	  		rotten = "\nRotten Tomatoes Score: N/A"; //log it as N/A
	  	} else {  //else the score exists
	  		rotten = "\nRotten Tomatoes Score: "+JSON.parse(body).Ratings[1].Value; //store the RT score
	  	} //end if statements for rotten tomato score

	    console.log(title+year+imdb+rotten+country+language+plot+actors); //console.log all the variables

		var stream = fs.createWriteStream("log.txt",{'flags': 'a'});
		stream.once('open', function(fd) {
			if ((value !== "Mr Nobody") && (doWhat === false)) {
				stream.write("\n\n$ node liri.js movie-this "+value);
			} else if ((value !== "Mr Nobody") && (doWhat === true)) {
				doWhat = false;
			} else if ((value === "Mr Nobody") && (doWhat === false)) {
				stream.write("\n\n$ node liri.js movie-this ");
			}
			stream.write("\n\n");
			stream.write(title+year+imdb+rotten+country+language+plot+actors);
			stream.write("");
			stream.end();
		});

	  } else {
	  	console.log(error); //console.log if error from request
	  }
	}); //end request
} //end movie function

function random(doWhat) { //random function for do-what-it-says action
	doWhat = true;
	var fs = require("fs"); //reqire fs for reading txt file
	fs.readFile("random.txt", "utf8", function(error, data) { //read file random.txt

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }
	  // Then split it by commas (to seperate the method and value arguments)
	  var dataArr = data.split(",");
	  var method = dataArr[0]; //setting method variable as 1st array item
	  var value = dataArr[1].replace('"','').replace('"',''); //setting value variable as 2nd array item, and remove redundant ""
	  // console.log(method);
	  // console.log(value);
	  //set conditionals for each method
	  if (method === "spotify-this-song") { //if random.txt first starts with spotify-this-song
	  	spotify(value, doWhat); //pass value variable to the spotify function
	  } else if (method === "movie-this") { //if random.txt first starts with movie-this
	  	movie(value, doWhat); //pass value variable to the movie function
	  } else if (method === "my-tweets") { //if random.txt first starts with my-tweets
	  	value = "N/A"; //there is no value to pass
	  	tweets(doWhat); //go to tweets function
	  } else {
	  	console.log("random.txt isn't formatted correctly") //otherwise, txt file isn't formatted the same as the example
	  }
	var stream = fs.createWriteStream("log.txt",{'flags': 'a'});
	stream.once('open', function(fd) {
		stream.write("\n\n$ node liri.js do-what-it-says | random.txt is calling: "+method+", with value of: "+value);
		stream.end();
	});
	}); //end read file
} //end random function