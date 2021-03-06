var express = require('express');
var router = express.Router();
var fs = require('fs');
var crypto = require('crypto');
var mime = require('mime');
var jwt = require('jsonwebtoken');

var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
    	cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage });

var mongoose = require('mongoose');
var Sculpture = mongoose.model('Sculpture');
var File = mongoose.model('File');

router.get('/', function(req, res){
	res.send("Hello")
});

var fields = upload.fields([{name: 'image', maxcount: 1}, {name: 'audio', maxcount: 1}, {name: 'video', maxcount: 1}]);

router.post('/delete', function(req, res, next){
	var token = req.body.token;

	if(token) {
	    // verifies secret and checks exp
	    jwt.verify(token, 'UPDSECRET', function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	      		console.log('authenticated');
				Sculpture.remove({ sculpture_name: req.body.sculpture_name }, function(err) {
					if(err){
						console.log(err);
						res.send(err);
					}
					else{
						console.log("deleted");
					}
				});
	      }
    	});

	  } else {

	    // if there is no token
	    // return an error
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
	    
	  }

});

router.post('/', fields, function(req, res, next){
	var sculpture_name = req.body.sculpture_name;
	var token = req.body.token;

	if (token) {
	    // verifies secret and checks exp
	    jwt.verify(token, 'UPDSECRET', function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	      		console.log('authenticated uploads');
				var image_exists = 'image' in req.files ? true : false;
				var audio_exists = 'audio' in req.files ? true : false;
				var video_exists = 'video' in req.files ? true : false;

				console.log("video_exists is " + video_exists);
				console.log("image_exists is " + image_exists);
				console.log("audio_exists is " + audio_exists);


				if(image_exists === true){
					var image = {
						file_name: req.files['image'][0].filename,
						path: "/uploads/" + req.files['image'][0].filename,
						associated_sculpture: sculpture_name,
						type: "image"
					};
					var image_file = new File(image);
				}

				if(audio_exists === true){
					var audio = {
						file_name: req.files['audio'][0].filename,
						path: "/uploads/" + req.files['audio'][0].filename,
						associated_sculpture: sculpture_name,
						type: "audio"
					};
					var audio_file = new File(audio);
				}

				if(video_exists === true){
					console.log("video_exists is true");
					var video = {
						file_name: req.files['video'][0].filename,
						path: "/uploads/" + req.files['video'][0].filename,
						associated_sculpture: sculpture_name,
						type: "video"
					};
					var video_file = new File(video);
					console.log("created video file");
				}


				if(image_exists === true){
					image_file.save(function(err, result){
						if(err){
							console.log(err);
							res.send(err);
						} 
					});

					Sculpture.update({sculpture_name: sculpture_name}, {$set: { image: image.path }}, function(err, result){
						if(err){
							console.log(err);
							res.send(err);
						} 
					});
				}

				if(audio_exists === true){
					audio_file.save(function(err, result){
						if(err){
							console.log(err);
							res.send(err);
						} 
					});

					Sculpture.update({sculpture_name: sculpture_name}, {$set: { audio: audio.path }}, function(err, result){
						if(err){
							console.log(err);
							res.send(err);
						} 
					});
				}

				if(video_exists === true){
					console.log("saving video file");
					video_file.save(function(err, result){
						if(err){
							console.log(err);
							res.send(err);
						} 
					});

					Sculpture.update({sculpture_name: sculpture_name}, {$set: { video: video.path }}, function(err, result){
						if(err){
							console.log(err);
							res.send(err);
						} 
					});
				}

				res.send("OK");
	      }
	    });

	  } else {

	    // if there is no token
	    // return an error
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
	    
	  }

});
 
module.exports = router;
