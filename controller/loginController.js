var config = require('../config'); // get our config file
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
var User = require('../model/User');
var multer = require('multer');
var path = require('path');

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

var upload = multer({
    storage: store
}).single('sampleFile');

exports.uploadFile=function(req,res){
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
