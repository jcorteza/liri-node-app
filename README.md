# LIRI, a Node.js Application
Meet LIRI, a Language Interpretation and Recognition Interface for your terminal, created with node.

## LIRI's Capabilities
* LIRI can "concert-this." Concert-this is a feature that allows you to search the upcoming of a musician or band of your choice.
* LIRI can "spotify-this-song." Spotify-this-song is a feature that allows you to search a musican or band on Spotify and see a list of related songs complete with Album info and a link to a song sample.
* LIRI can "movie-this." Movie-this is a feature that allows you to search a movie on IMDB and see a lists of actors, ratings, languages, and the plot.
* LIRI can "do-what-it-says." By "it" I mean a text file. You can tell LIRI what to do (concert-this, spotify-this-song, or movie-this) with a simple text file that contains the instructions, e.g. movie-this, The Lion King.
* LIRI as appends the data of each command to a log.txt document for you.

### Using LIRI
Download the source code or make a copy of this repo on your local computer. Then LIRI is as easy as entering a few commands into your terminal.

### LIRI Commands
* concert-this
* spotify-this-song
* movie-this
* do-what-it-says

Note: LIRI's commands are case sensitive.

### Giving LIRI A Command
Every command, except for do-what-it-says, requires additional information such as an artist name, a song name, or a movie title for LIRI to give you the information you requested.

Syntax: [`node liri.js <command> <additional-information>`]

Sample Commands:  
`node liri.js movie-this la la land` . 
`node liri.js do-what-it-says` . 
`node liri.js concert-this adele` . 

Note: without additional information, spotify-this-song defaults to The Sign by Ace of Base and movie-this defaults to Mr. Nobody.

