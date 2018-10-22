require('dotenv').config();
const keys = require('./keys.js');
const fs = require('fs');
const request = require('request');
const S = require('string');
const moment = require('moment');

// if a 3rd process argument has been entered liri() will run otherwise an error is thrown
if (process.argv[2]) {
    liri();
}
else {
    throw 'You must enter one of the following commands for LIRI to work: concert-this, spotify-this-song, movie-this, or do-what-it-says';
}
// switch case of tasks for liri to complete based on user input
function liri() {
    const task = process.argv[2];
    if(task === 'concert-this' || task === 'spotify-this-song' || task === 'movie-this' || task === 'do-what-it-says') {
        let searchPhrase = "";
        for(i = 3; i < process.argv.length; i++){
            searchPhrase += `${process.argv[i]} `;
        }
        searchPhrase = S(searchPhrase).collapseWhitespace().s;
        switch(task){
            case 'concert-this':
                if(process.argv.length < 4) throw 'You must enter an artist for LIRI to "concert-this."'
                eventInfo(searchPhrase);
                break;
            case 'spotify-this-song':
                if(process.argv.length < 4){
                    searchPhrase = 'The Sign Ace of Base';
                }
                songInfo(searchPhrase);
                break;
            case 'movie-this':
                if(process.argv.length < 4){
                    searchPhrase = 'Mr. Nobody';
                }
                searchPhrase = S(searchPhrase).titleCase().s;
                movieInfo(searchPhrase);
                break;
            case 'do-what-it-says':
                if(process.argv.length < 4) throw 'You must enter a file path such as "this-file/random.tx" for LIRI to "do-what-it-says."'
                fs.readFile(searchPhrase, 'utf8', (error, data) => {
                    if(error) throw error;
                    let liriCommand = data.split(',');
                    for(const i in liriCommand){
                        liriCommand[i] = liriCommand[i].trim();   
                        liriCommand[i] = liriCommand[i].replace(/"/g, '');   
                    }
                    liriCommand[1] = liriCommand[1].split(' ');
                    for(i = 0; i < liriCommand[1].length; i++) {
                        process.argv[3 + i] = liriCommand[1][i];
                    }
                    process.argv[2] = liriCommand[0];
                    liri();                   
                });
                break;
        }
    }
    else {
        throw `"${task}" is not a recognized command. Please enter: concert-this, spotify-this-song, movie-this, or do-what-it-says`;
    }
}
function DisplayEventInfo(event){
    const date = moment(event.datetime, moment.ISO_8601).format('MM/DD/YYYY');
    console.log('=======================/CONCERT-THIS/==========================');
    console.log(`Lineup: ${(event.lineup).toString().replace(/,/g, ', ')}`);
    console.log(`Venue: ${event.venue.name}`);
    (event.venue.region !== "") ? console.log(`Location: ${event.venue.city}, ${event.venue.region}`) : console.log(`Location: ${event.venue.city}, ${event.venue.country}`);
    console.log(`Date: ${date}`);
    console.log('');
    fs.appendFile('log.txt', `=======================/CONCERT-THIS/==========================\nLineup: ${(event.lineup).toString().replace(/,/g, ', ')}\nVenue: ${event.venue.name}\nLocation: ${event.venue.city}, ${event.venue.region} ${event.venue.country}\nDate: ${date}\n\n`, (error) => {if(error) throw error;});
}
function eventInfo(artistname) {
    const Url = `https://rest.bandsintown.com/artists/${artistname}/events?app_id=${keys.bandsKey}&date=upcoming`;
    console.log(Url);
    request(Url, (error, response, body) => {
        const data = JSON.parse(body);
        if(error) throw 'Whoops! Something went wrong...';
        if(data[0] === undefined || data[0] === 0){
            console.log('Sorry, no concerts coming up.\n');
            console.log('   ¯\\_(ツ)_/¯\n')
        }
        else if(response){
            for(const key in data){
                const event = data[key];
                DisplayEventInfo(event);
            }
        }
    });
}
function songInfo(song){
    const SpotifyAPI = require('node-spotify-api');
    const spotify = new SpotifyAPI({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });
    spotify.search({type: 'track', query: song, limit: 10}, (error, data) => {
        if(error) throw `Error: ${error}`;
        const songData = data.tracks.items;
        if(data.tracks.total === 0){
            console.log(`Sorry, LIRI was unable to find "${song}." Check the spelling and try again!\n`);
            console.log('   ¯\\_(ツ)_/¯\n')
        }
        else {
            for(const key in songData){
                let artistText = '';
                const artistData = songData[key].artists;
                for(const key in artistData){
                    artistText += `${artistData[key].name}, `;
                }
                artistText = S(artistText).replaceAll(/,\s$/, '').s;
                console.log('#/#/#/#/#/#/#/#/#/#/#/#/SPOTIFY-THIS-SONG/#/#/#/#/#/#/#/#/#/#/#/#/')
                console.log(`Song: ${songData[key].name}`);
                console.log(`Album: ${songData[key].album.name}`);
                console.log(`Artist(s): ${artistText}`);
                console.log(`Song Preview: ${songData[key].external_urls.spotify}`);
                console.log('');
                fs.appendFile('log.txt' `#/#/#/#/#/#/#/#/#/#/#/#/SPOTIFY-THIS-SONG/#/#/#/#/#/#/#/#/#/#/#/#/\nSong: ${songData[key].name}\nAlbum: ${songData[key].album.name}\nArtist(s): ${artistText}\nSong Preview: ${songData[key].external_urls.spotify}\n\n`, (error) => {if(error) throw error;});
            };
        }
    });
}
function movieInfo(movie) {
    const Url = `http://www.omdbapi.com/?apikey=${keys.omdbKey}&t=${movie}`;
    request(Url, (error, response, body) => {
        if(error) throw error;
        const data = JSON.parse(body);
        if(data.Error === 'Movie not found!'){
            console.log('Sorry, LIRI could not movie-this. Check the spelling and try again!\n');
            console.log('   ¯\\_(ツ)_/¯\n')
        }
        else {
            let imdbRating = '';
            let rottenTom = '';
            console.log('^_^_^_^_^_^_^_^_^_^_^_^_^_^/MOVIE-THIS/^_^_^_^_^_^_^_^_^_^_^_^_^_^_^');
            console.log(`${data.Title}, ${data.Year}`);
            for(const key in data.Ratings){
                if(data.Ratings[key].Source === 'Internet Movie Database') imdbRating = `IMDB Rating: ${data.Ratings[key].Value}`;
                if(data.Ratings[key].Source === 'Rotten Tomatoes') rottenTom = `Rotten Tomates: ${data.Ratings[key].Value}`;
            }
            const movieRatings = (`${imdbRating}  ${rottenTom}`).trim();
            console.log(movieRatings);
            console.log(`Actors: ${data.Actors}`);
            console.log(`Language: ${data.Language}`);
            console.log(`Country: ${data.Country}`);
            console.log(`***PLOT***\n${data.Plot}`);
            console.log('');
            fs.appendFile('log.txt', `^_^_^_^_^_^_^_^_^_^_^_^_^_^/MOVIE-THIS/^_^_^_^_^_^_^_^_^_^_^_^_^_^_^\n${data.Title}, ${data.Year}\n${movieRatings}\nActors: ${data.Actors}\nLanguage: ${data.Language}\nCountry: ${data.Country}\n***PLOT***\n${data.Plot}\n\n`, (error) => {if(error) throw error;});
        }
    });
}
