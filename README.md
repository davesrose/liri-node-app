I have followed instructions to create a .gitignore file to not push the node_modules folder or .DS_Store (though I've researched and found out it's specific to Apple OS: I'm working on a PC).  Appart from the required node packages, I also installed moment to be able to reformat the time of when a tweet is posted.

I have created a switch to handle the action arguments (my-tweets, spotify-this-song, movie-this, and do-what-it-says).  If the user types something else, they'll be alerted to try another action (it won't be logged to the log.txt though).

For the do-what-it-says action, I've tested the random.txt file with different actions and values.  It works with the example's formatting, and will alert the user if random.txt isn't formatted correctly.

For the bonus, I thought the validation alerts didn't need to be logged.  Log.txt gets written by the fs.createWriteStream (with append option).
