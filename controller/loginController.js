var config = require('../config'); // get our config file
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
var User = require('../model/User');
var multer = require('multer');
var path = require('path');

// import async series package
var async = require("async");
//var gm = require('gm');
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});


/* Login Using Mongoose Model */
exports.loginUserUsingMongooseModel = function(req, res){

    User.findOne({
        email: req.body.email,
        status: 'active'
    },{},function(err, user) {
        if (err) {
            throw err;
        }

        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' }, 401);
        } else if (user) { 
            var pass=user.password;
          if(bcrypt.compareSync(req.body.password,pass)){
                //console.log('in bcrypt.hashSync(req.body.password)==u.get(password)')
                var token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn: 86400});
                res.json({
                    status: true,
                    token: token
                });
            }else{
                console.log('in else');
                res.json({
                    status: false,
                    message: "Invalid Credentials Provided"
                });
            }    
        }
    });
}

/* FILE Upload */
var store = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,'./public/images');
    },
    filename: function(req,file,callback){
        callback(null,file.originalname);
    } 
});

// var upload = multer({
//     storage: store
// }).single('sampleFile');

/* for angular 5 file upload */
var upload = multer({
    storage: store
}).single('image');

exports.uploadFile = function(req,res){
    console.log(req.file);   
    upload(req,res,function(err){
        if(err){
            res.json(err);
        }
        res.json('success');
    });
}

exports.addUserUsingMongooseModel = function(req, res){
    //var password_hash = bcrypt.hashSync(req.body.password,10);
    //req.body.password = password_hash;
    var newUser = new User(req.body);
    newUser.save(function (err) {
        if (err){
            res.json(err); 
            //return handleError(err);
        }else{
            res.json("New User Created Successfully");
        }
        // saved!
        }
    );
}


exports.asynchSeriesExample = function(req, res){
    
    async.series([    
        function(callback){
            //console.log(callback);
            setTimeout(function(){
                console.log("Task 1");
                callback(null, abc());
            }, 300);
        },

        function(callback){
            setTimeout(function(){
                console.log("Task 2");
                callback(null, 2);
            }, 200);        
        },
        
        function(callback){
            setTimeout(function(){
                console.log("Task 3");
                callback(null, 3);
            }, 100);
        }

    ], function(err, result){
        console.log(result);
    });
}

function abc(){
    var a = "xyz";
    return a    
}

/* IMAGE MANIPULATION USING MG (MagicGrahpics)*/
exports.cropImageUsingMg = function(req, res){
    gm('./public/images/images_for_mg.jpeg')
    .gravity('Center') // Move the starting point to the center of the image.
    .crop(100, 100,50,50)
    .write('./public/images/abc.jpeg', (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("image croped");
            res.json("image croped");
        }
        
    })
}


/* IMAGE MANIPULATION USING MG (MagicGrahpics)*/
exports.resizeImageUsingMg = function(req, res){
    gm('./public/images/images_for_mg.jpeg')
    .resize(100, 100)
    .write('./public/images/resize.jpeg', (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("image croped");
            res.json("imaged resized");
        }
        
    })
}


/* EXTRACT IMAGE ALL PROPERTIES */
exports.extractsAllPropertiesOfImage = function(req, res){
    gm('./public/images/abc.jpeg')
    .identify(function(err, result){
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    });    
}
