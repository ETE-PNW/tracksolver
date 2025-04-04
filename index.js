const express = require('express');
const boom = require('@hapi/boom');
const bodyParser = require('body-parser');

const tracks = require('./track');

const server = express();

server.set('port', process.env.PORT || 3000);

server.set('view engine', 'ejs');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

function validateParameters(length, model, tolerance){
  const l = Number(length);
  const t = Number(tolerance);
  const m = tracks.getTracks()[model];

  if(!m){
    return "Model not found";
  }

  if(isNaN(l)){
    return "Length is invalid. Must be a number > smaller track in the set and < 10000";
  }

  if(l > 10000){
    return "Length is too long. Maximum length is 10000.";
  }

  if(l < 0){
    return "Length must be over 0. Typically the shortest track in the set";
  }

  if(isNaN(t) || t < 0 || t > 3){
    return "Tolerance must be a positive number not larger than 3mm";
  }

  return null;
} 

//Very basic API
server.get('/api/tracks', (req, res, next) => {
  res.json(tracks.getTracks());
});

server.get('/api/tracks/:model', (req, res, next) => {
  const model = req.params.model;
  const track = tracks.getTracks()[model];
  if(!track) return res.status(404).send('Invalid track model');
  res.json(track);
});

server.post('/api/compute', (req, res, next) => {
  const model = req.body.model;
  const length = Number(req.body.length);
  const tolerance = Number(req.body.tolerance || 0);
  const tracksToUse = req.body.tracksToUse;
  const e = validateParameters(length, model, tolerance);
  if(e) return res.json({error: e});
  res.json(tracks.findTrackCombinations(model, tracksToUse, length, tolerance));
});  

// Web app

// Used to show the logo on main screen
server.get('/logo', (req, res, next) => {
  res.sendFile(__dirname + '/views/img/ETELogo.png');
});

server.get("/", (req, res, next)=>{
  return res.render('input', 
                    {
                      tracks: tracks.getTracks(),
                      max: req.query.max ? Number(req.query.max) : "" 
                    });
});

server.get("/compute", (req, res, next)=>{
  res.redirect('/');
});

server.post('/compute', (req, res, next) => {
  const model = req.body.model;
  const length = Number(req.body.length);
  var tolerance = Number(req.body.tolerance);

  //Use a default tolerance of 0.001 if user requests "0". This is to avoid floting point errors
  //when comparing the length of the track to the target length.
  if(tolerance === 0){
    tolerance = 0.001;  
  }

  let tracksToUse = req.body.tracksToUse;
  var maxSolutions;

  if(req.body.max){
    maxSolutions = Number(req.body.max);
  }

  const e = validateParameters(length, model, tolerance);
  
  if(e){
    return next(e);
  }

  if(tracksToUse && !Array.isArray(tracksToUse)){
    tracksToUse = [tracksToUse];
  }

  //Function return results ordered by error and track count
  let result = tracks.findTrackCombinations(model, tracksToUse, length, tolerance, maxSolutions);

  if(result.error){
    return next(result.error);
  }

  return res.render('output', 
                    { result: result,
                      trackModel: model, 
                      targetLength: length,
                      tracksToUse: tracksToUse
                    });
});

server.get('/tracks', (req, res, next) => {
  console.log(tracks.getTracks());
  return res.render('tracks', 
                    { 
                      trackTypes: tracks.getTracks() 
                    });
});

server.use((err, req, res, next) => {
  res.render('error', { errorMessage: err });
});

server.listen(server.get('port'), function() {
  console.log('Node app is running on port: ' + server.get('port'));
});