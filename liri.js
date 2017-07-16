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

var doWhat = false; //creating bolean variable for logging do-what-it-says method or the others

//creating switch for each action argument
switch (action) {
  case "my-tweets":
    tweets(doWhat); //pass doWhat bolean
    break;

  case "spotify-this-song":
    spotify(value, doWhat); //pass value from arguments, as well as doWhat bolean
    break;

  case "movie-this":
    movie(value, doWhat); //pass value from arguments, as well as doWhat bolean
    break;

  case "do-what-it-says":
    random(doWhat); //pass doWhat bolean
    break;
  //validation for person trying a different action
  default:
  	console.log("Try a different action");
}

//twitter function
function tweets(doWhat) {
	var fs = require("fs"); //require fs for writting to log.txt
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
	  if (!error) { //if no error
	  	console.log(""); //first console log username and divider
	  	console.log("Tweets for davesrose16");
	  	console.log("-----------------------");
		var stream = fs.createWriteStream("log.txt",{'flags': 'a'}); //start createWriteStream to log to log.txt
		stream.once('open', function(fd) { //have stream function start 
			if (doWhat === true) { //if doWhat bolean is true, it's coming from do-what-it-says...set doWhat back to false
				doWhat = false;
			} else {
				stream.write("\n\n$ node liri.js my-tweets\n"); //else it's my-tweets and gets written to log.txt
			}
			stream.write("\nTweets for davesrose16\n-----------------------"); //write my screen name (davesrose16)
	  	tweets.length <= 20; //set tweets length to latest 20
	  	for (var z = 0; z < tweets.length; z++) { //creating loop to display each tweet
	  		var timeStamp = moment(tweets[z].created_at, "ddd mmm HH:mm:ss Z yyyy").format("MM/DD/YYYY") //getting month, day and year from moment: can't get it to recognize twitter's hour format from this
	  		var hours = tweets[z].created_at; //getting entire twitter timestamp
	  		var hourStamp = hours.substr(11,14); //grabbing the HH:mm:ss +0000 in the timestamp
	  		hourStamp = moment(hourStamp, "HH:mm:ss ZZZZ").format("hh:mm A"); //moment will correctly format timezone time in this format
	  		console.log(timeStamp+" "+hourStamp+": '"+tweets[z].text+"'"); //display time and tweet text
	  		console.log("");

				stream.write("\n"+timeStamp+" "+hourStamp+": '"+tweets[z].text+"'\n"); //write each tweet to log.txt


		} //end for loop
				stream.end(); //end stream write
			}); //end createWriteStream
	  } else {
	  	console.log(error); //if error, display it
	  }
	}); //end get response
} //end twitter function
//spotify function
function spotify(value, doWhat) {

	var fs = require("fs"); //require fs for createWriteStream

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

	var stream = fs.createWriteStream("log.txt",{'flags': 'a'}); //start createWriteStream
	stream.once('open', function(fd) { //start createWriteStream function
		if ((value !== "The+Sign+Ace+of+Base") && (doWhat === false)) { //if value isn't the sign, and doWhat is false, log that the command was spotify-this-song with given value
			stream.write("\n\n$ node liri.js spotify-this-song "+value);
		} else if ((value !== "The+Sign+Ace+of+Base") && (doWhat === true)) {// if doWhat is true, do-what-it-says has been logged.  Return doWhat to false
			doWhat = false;
		} else if ((value === "The+Sign+Ace+of+Base") && (doWhat === false)) { //if value is the sign, and doWhat is false, log that the command was spotify-this-song without a value
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
  		stream.write(" Track : "+parseInt(w+1)+" ----------------------\n"); //write track number
  		stream.write(" Artist Name: "+tracks[w].artists[0].name+"\n"); //write artist name
  		stream.write(" Song Name: "+tracks[w].name+"\n"); //write song name
  		stream.write(" Song Url: "+tracks[w].external_urls.spotify+"\n"); //write spotify url
		stream.write(" Album Name: "+tracks[w].album.name+"\n"); //write album name
		stream.write("\n");
			
	  }
		stream.end(); //end stream write
	}); //end createWriteStream
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

		var stream = fs.createWriteStream("log.txt",{'flags': 'a'}); //start createWriteStream
		stream.once('open', function(fd) { //start stream function
			if ((value !== "Mr Nobody") && (doWhat === false)) { //if the value isn't the default Mr Nobody, and doWhat is false, write that movie-this was typed and include the value typed
				stream.write("\n\n$ node liri.js movie-this "+value);
			} else if ((value !== "Mr Nobody") && (doWhat === true)) { //if doWhat is true, do-what-it-says has been logged, and doWhat is changed back to false
				doWhat = false;
			} else if ((value === "Mr Nobody") && (doWhat === false)) { //if value is Mr Nobody, then user hasn't entered a value: log movie-this without a value
				stream.write("\n\n$ node liri.js movie-this ");
			}
			stream.write("\n\n"); //write next line breaks
			stream.write(title+year+imdb+rotten+country+language+plot+actors); //write movie detail variables
			stream.write("");
			stream.end(); //end stream
		}); //end createWriteStream

	  } else {
	  	console.log(error); //console.log if error from request
	  }
	}); //end request
} //end movie function

function random(doWhat) { //random function for do-what-it-says action
	doWhat = true; //set doWhat bolean as true to track when do-what-it-says was called
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
		var stream = fs.createWriteStream("log.txt",{'flags': 'a'}); //start createWriteStream
		stream.once('open', function(fd) { //start stream function
			stream.write("\n\n$ node liri.js do-what-it-says | random.txt is calling: "+method+", with value of: "+value); //write that do-what-it-says was called, and log what method and value was written to in random.txt
			stream.end(); //end this write stream, as the call will be logged with other functions
		}); //end createWriteStream function
	}); //end read file
} //end random function