const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const clientId = '00c41411c2214a6996aa703daaa56a14',
    clientSecret = 'c32b2553f6a84f5a909bb3290ed6949e';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// setting the spotify-api goes here:
app.get('/', function (req, res) {
  res.render('home')
})
app.get('/artists', function (req, res) {
  spotifyApi.searchArtists(req.query.artistName)
  .then(data => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists', {theInfo: data.body.artists.items, whatUserRequested: req.query.artistName})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
    res.redirect('/')
  })
});

app.get('/album/:id', function (req, res) {

// get albums by a certain artist
spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {

    res.render('album', {theAlbum: data.body.items})
  }, function(err) {
    console.error(err);
  });

});

app.get('/albums/tracks/:id', function (req, res) {

  //get tracks in a certain album
  spotifyApi.getAlbumTracks(req.params.id) 
    .then(function(data) {
      const tracks = data.body.items;
      res.render('tracks', {tracks})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
      res.redirect('/')
    })
});




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
