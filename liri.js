require('dotenv').config();
const keys = require('./keys.js');
const request = require('request');
const S = require('string');
const moment = require('moment');
const spotifyAPI = require('node-spotify-api');
const task = process.argv[2];

// if a 3rd process argument has been entered liri() will run otherwise an error is thrown
if (task) {
    liri();
}
else {
    throw `You must enter a command for LIRI to work. Choose from the following: concert-this, spotify-this-song, movie-this, or do-what-it-says`;
}
// switch case of tasks for liri to complete based on user input
function liri() {
    if(task === 'concert-this' || task === 'spotify-this-song' || task === 'movie-this' || task === 'do-what-it-says') {
        // if a 4th process argument does not exist an error is thrown 
        if(process.argv.length < 4) {
            switch(task){
               case 'concert-this':
                    throw 'You must enter an artist for LIRI to "concert-this."';
                case 'spotify-this-song':
                    throw 'You must enter a song for lIRI to "spotify-this-song."';
                case 'movie-this':
                    throw 'You must enter a movie title for LIRI to "movie-this."';
                case 'do-what-it-says':
                    throw 'You must enter BLANK for LIRI to "do-what-it-says."'; 
            }
        }
        // otherwise liri switch case runs
        else {
            let searchPhrase = "";
            for(i = 3; i < process.argv.length; i++){
                searchPhrase += `${process.argv[i]} `;
            }
            searchPhrase = S(searchPhrase).collapseWhitespace().s;
            searchPhrase = S(searchPhrase).replaceAll(' ', '%20').s;
            searchPhrase = S(searchPhrase).replaceAll('/', '%252F').s;
            searchPhrase = S(searchPhrase).replaceAll('?', '%253F').s;
            searchPhrase = S(searchPhrase).replaceAll('*', '%252A').s;
            searchPhrase = S(searchPhrase).replaceAll(/\\/g, '%27C').s;
            console.log(`The search phrase is "${searchPhrase}"`);
            console.log(typeof searchPhrase);
            switch(task){
                case 'concert-this':
                    console.log('concert-this requested');
                    /*"Can be one of the following values: \"upcoming\", \"past\", \"all\", or a date range e.g. \"2015-05-05,2017-05-05\". If not specified, only upcoming shows are returned"*/
                    eventInfo(searchPhrase);
                    break;
                case 'spotify-this-song':
                    console.log('spotify-this-song requested');
                    break;
                case 'movie-this':
                    console.log('movie-this requested');
                    break;
                case 'do-what-it-says':
                    console.log('do-what-it-says requested');
                    break;
            }
        }
    }
    else {
        throw `"${task}" is not a recognized command. Please enter: concert-this, spotify-this-song, movie-this, or do-what-it-says`;
    }
}
function DisplayEventInfo(event){
    const date = moment(event.datetime, moment.ISO_8601).format('MM/DD/YYYY');
    console.log('===============================================================');
    console.log(`Venue: ${event.venue.name}`);
    (event.venue.region !== "") ? console.log(`Location: ${event.venue.city}, ${event.venue.region}`) : console.log(`Location: ${event.venue.city}, ${event.venue.country}`);
    console.log(`Date: ${date}`);
}
function eventInfo(artistname) {
    const Url = `https://rest.bandsintown.com/artists/${artistname}/events?app_id=${keys.bandsKey}&date=upcoming`;
    console.log(Url);
    request(Url, (error, response, body) => {
        if(error) throw 'Whoops! Something went wrong...';
        const data = JSON.parse(body);
        for(const key in data){
            const event = data[key];
            DisplayEventInfo(event);
        }
    });
}
