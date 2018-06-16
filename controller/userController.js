var config = require('../config'); // get our config file
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectID;
//var db = require('../database');
var User = require('../model/User');
var UserContact = require('../model/UserContact');
var Flashcard = require('../model/Flashcard');

//var express_fileUpload = require('express-fileupload');
var multer = require('multer');
var path = require('path');
var mongoose = require('mongoose');

// for file operations
var fs = require('fs');

// for whether information
let request = require('request');

// sendgrid library
const sgMail = require('@sendgrid/mail');
//const sgMail = require('@sendgrid/client');
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//sgMail.setApiKey("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");
sgMail.setApiKey("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");

var nodemailer = require('nodemailer');

// Read Data csv file
var csv = require('csv');
// Write data to csv file
var Json2csvParser = require('json2csv').Parser; 


/* add new  user */
exports.addUser = function(req, res){    
    var collection = req.db.get('usercollection');
    //password_hash = bcrypt.hashSync(req.body.password, 10);
    var password_hash = bcrypt.hashSync("123456", 10);
    req.body.password = password_hash;

    collection.insert(req.body, function(err, success){
        if(err){
            res.json("something went go wrong");
        }else{
            res.json("added successfully");
        }
    });
}

/* Update user */
exports.updateUser = function(req, res){
    var id = req.params.id;
    var collection = req.db.get("usercollection");
    collection.findOneAndUpdate({ _id : ObjectId(id)}, {$set: req.body}, function(err, success){
        if(err){
            res.json(err);
        }else{
            res.json("user updated successfully");
        }
    });
}


exports.getUser = function(req, res){
    var id = req.params.id;
    var collection = req.db.get('usercollection');
    collection.findOne({ _id : ObjectId(id)}).then((doc) => {
        res.json(doc);
    });
}

exports.deleteUser = function(req, res){
    id = req.params.id;
    var collection = req.db.get('usercollection');
    collection.remove({_id : id});
    res.json("user delete successfully");
}

exports.loginUser = function(req, res){

    var collection = req.db.get('usercollection');
    
    collection.findOne({
        email: req.body.email
      }, function(err, user) {
    
        if (err) {
            throw err;
        }
    
        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
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
                    message: "Something went wrong"
                });
            }
    
        }
      });
}

/* Login Using Mongoose Model */
exports.loginUserUsingMongooseModel = function(req, res){

    //var collection = req.db.get('usercollection');
    
    // var password_hash = bcrypt.hashSync("123456", 10);
    // var awesome_instance = new User({ username: 'awesome', email: "test12@gmail.com", password:  password_hash });
    // // Save the new model instance, passing a callback
    // awesome_instance.save(function (err) {
    //     if (err) return handleError(err);
    //     // saved!
    //     }
    // );

    // User.find({}, function(err, users) {
    //     if (err) throw err;
    //     // object of all the users
    //     console.log(users);
    // });

    User.findOne({
        email: req.body.email,
        status: 'active'
    },{},function(err, user) {
        if (err) {
            throw err;
        }

        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
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


exports.addUserUsingMongooseModel = function(req, res){

    var password_hash = bcrypt.hashSync(req.body.password,10);
    req.body.password = password_hash;

    var newUser = new User(req.body);
    newUser.password = password_hash;
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


exports.getAllUsersUsingMongooseModel = function(req, res){

    // User.find({'status' : 'active'}, function(err, users){
    //     if(err){
    //         res.json({"err": err, "msg" : "Could not fetch users, Something went wrong"});
    //     }else{
    //         res.json(users);
    //     }
    // });

    // Flashcard.create({ name : "test", type : "test", user : "5b165a94abac004739cd22b2" }, function(err, success){
    //     if(err){
    //         res.json(err);
    //     }else{}
    // });

    // ONE-TO-MANY REALTION //
    User.find({'status' : 'active'})
        .populate('user_contact','home_number')
        .populate('flashcard','_id type name user'/*, function(err, flashcard){
            if(err){
                res.json(err);
            }
            else{
                flascard.populate('user').exec();
            }
        }*/)
        .exec(function(err, users){
        if(err){
            res.json(err);
        }else{
            res.json(users);
        }
    });

    // MANY-TO-ONE(Inverse of relationship) //
    // UserContact.find({}).populate('user_id','username email').exec(function(err, users){
    //     if(err){
    //         res.json(err);
    //     }else{
    //         res.json(users);
    //     }
    // });
}


exports.getUserDetailsUsingMonooseModel = function(req, res){
    
    var id = req.params.id;

    User.findOne({_id: id}, function(err, data){
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
    });
}

exports.updateUserUsingMongooseModel = function(req, res){
    var id = req.params.id;
    User.findByIdAndUpdate({_id: mongoose.Types.ObjectId(id)},{$set: req.body}, function(err, data){
        if(err){
            res.json(err);
        }else{
            res.json("user updated successfully");
        }   
    });
}


/* UPLOAD file */
exports.fileUpload = function(req, res){

    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname+'/public/files/', function(err) {
        if (err)
        return res.status(500).send(err);
    
        res.json('File uploaded!');
    });
}

exports.addMultipleObjectsWithinArray = function(req, res){
    
    var multiple_contacts = req.body.user_contacts;

    var password_hash = bcrypt.hashSync(req.body.password,10);
    req.body.password = password_hash;

    var newUser = new User(req.body);
    newUser.save(function (err, user_id) {
        if (err){
            res.json(err); 
        }else{
            for(var i=0; i < multiple_contacts.length; i++){
                console.log(multiple_contacts[i]);
                //multiple_contacts[i].user_id = user_id
                
                var newusercontact = new UserContact(multiple_contacts[i]);
                newusercontact.user_id = user_id;
                newusercontact.save(function(err){
                    if(err){ res.json(err);}
                    else{
                        // var user = User.findById(user_id);
                        // user.user_contact.push(newusercontact);
                        // user.save(); 
                        
                        // var user = User.findById(user_id, function(err, usr){
                        //     if(err){
                        //         res.json(err);
                        //     }
                        //     //console.log(user);
                        //     usr.user_contact.push(newusercontact);
                        //     usr.save();
                        // });    
                    }
                });
            }


        }
    });
    res.json("user with multiple contact saved");
}


exports.updateMultipleObjectsWithinArray = function(req, res){

    var user_id = req.params.id
    var multiple_contacts = req.body.user_contacts;
    var password_hash = bcrypt.hashSync(req.body.password,10);
    req.body.password = password_hash;

    newUser = User.findOneAndUpdate({_id: mongoose.Types.ObjectId(user_id)}, { $set:req.body }, function(err, success){
        if(err){
           res.json(err); 
        }else{}
    });
    
    UserContact.deleteMany({user_id: user_id}, function(err, del){
        if(err){
            res.json(err);
        }else{}
    });
    for(var i=0; i < multiple_contacts.length; i++){
        console.log(multiple_contacts[i]);
        var newusercontact = new UserContact(multiple_contacts[i]);
        newusercontact.user_id = user_id;
        newusercontact.save(function(err){
            if(err){ res.json(err);}
            else{}
        });
    }    
    res.json("user with multiple contact updated");
}


// LIST All users from json file
exports.getAllUsersFromFile = function(req, res){

    fs.readFile("./users.json","utf8", function(err, data){
        if(err){
            res.json(err);
        }else{
            res.end(data);
        }
    });

}

// ADD user to json file
exports.addNewUserToJsonFile = function(req, res){
    var jsonData = req.body.user;
    fs.readFile("./users.json","utf8", function(err, data){
        if(err){
            res.json(err);
        }else{
            data = JSON.parse(data);
            data['user4'] = jsonData;
            json = JSON.stringify(data);
            
            fs.writeFile('./users.json', json, 'utf8', function(err, success){
                if(err){
                    res.json(err);
                }else{}
            });
            res.json("User added successfully");
        }
    });
}

// SHOW details from json file
exports.showDetailFromJsonFile = function(req, res){
    var id = req.params.id;
    fs.readFile('./users.json', 'utf8', function(err, data){
        if(err){
            res.json(err);
        }else{
            var users = JSON.parse(data);
            var user = users["user" + id];
            res.json(user);
        }
    });
}

exports.deleteFromJsonFile = function(req, res){
    var id = req.params.id;
    fs.readFile('./users.json', 'utf8', function(err, data){
        if(err){
            res.json(err);
        }else{
            users = JSON.parse(data);
            delete users['user'+id];
            json = JSON.stringify(users);
            fs.writeFile('./users.json', json,'utf8', function(err, data){
                if(err){
                    res.json(err);
                }else{}
            });    
            res.json({
                "msg" : "deleted successfully",
                "status" : 200
            });
        }
    });
}

// FOR Array of object (users_array.json) file.
exports.deleteFromUserArrayFile = function(req, res){

    fs.readFile('./users_array.json','utf8', function(err, data){
        if(err){
            res.json(err);
        }else{
            var fileData = JSON.parse(data);
            fileData.users.forEach((user, index) => {
                if (user.username === 'test2') {
                    fileData.users.splice(index, 1);
                }
            });
            
            json = JSON.stringify(fileData); // convert json to  string of json
            
            fs.writeFile('./users_array.json', json ,'utf8', function(err, data){
                if(err){
                    res.json(err);
                }else{
                    res.json("Object from deleted successfully");
                }
            });
        }
    });
}

exports.addObjectToArray = function(req, res){
    
    var requesteData = req.body.user;
    
    fs.readFile('./users_array.json','utf8', function(err, data){
        if(err){
            res.json(err);
        }else{
            fileData = JSON.parse(data);
            fileData.users.push(requesteData);
            fileData = JSON.stringify(fileData);
            fs.writeFile('./users_array.json',fileData,'utf8', function(err, data){
                if(err){
                    res.json(err);
                }else{
                    res.json("Object added successfully");
                }
            });
        }
    });
}


/***************
 * BUFFER USES
***************/

exports.cwrUsingBuffer = function(req, res){
    const buf1 = Buffer.allocUnsafe(11); // create buffer
    const len = buf1.write('welcomeuser'); // write some values to buffer
 
    // read value from buffer
    for(const byt of buf1.values()){ 
        console.log(byt);
    }
    var buf = new Buffer("Hello Pratik");
    // read original value
    //console.log(buf1.toString());    
    //console.log(req.method);
    if(req.method === 'GET'){
        res.json(buf.toString());
    }else{
        res.json("post method");
    }
}

/* third party api calling from nodejs */
exports.whetherInformation = function(req, res){
    let apiKey = 'a3209c86ec5cc63095f328c08fed7cd6';
    let city = 'Nagpur';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            console.log('error:', error);
        } else {
            console.log('body:', body);
            res.end(body);
        }
    });
}

/* send grid mail functionality */
exports.sendMailUsingSendgrid = function(req, res){
    const msg = {
        to: 'pratiktadas70@gmail.com',
        from: 'ptadas5@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    
    sgMail.send(msg, function(err, success){
        if(err){
            res.json(err);
        }else{
            res.json(success);
        }
    });
}


/* READ data from csv file */
exports.readDataFromCsvFile = function(req, res){
    var obj = csv();

    var emptyArray = [];
    obj.from.path('./test.csv').to.array(function(data){
        for(var i = 1; i < data.length; i++){    
            var newOnject = {
                "first_nmae" : data[i][0],
                "last_name" : data[i][1],
                "gender" : data[i][2]
            };
            emptyArray.push(newOnject);

            /* create new user from csv import */
            newUserObject = {
                "username" : data[i][0],
                "email" : "import_csv_testing@konverge.ai",
                "password" : "123456"
            };
            newUser = new User(newUserObject);
            newUser.save(function(err, data){
                if(err){
                    res.json(err);
                }else{}
            });                
        }
        res.json(emptyArray);
    }); 
}

exports.writeDataToCsvFile = function(req, res){

    var fields = ['first_name','last_name','gender'];
    var newUser = [
                    {
                        'first_name' : 'test_to_write_csv_file',
                        'last_name' : 'test',
                        'gender' : 'gender'
                    }
                ];
    var newLine = "\r\n";
   // fields =  (fields + "\r\n");
    const json2csvParser = new Json2csvParser({fields, header : false,  newLine : '\r\n'});
    const new_csv = json2csvParser.parse(newUser);
    
    fs.appendFile('./test.csv',new_csv, function(err){
        if(err){
            res.json(err);
        }else{
            console.log(new_csv);
            res.json("write to csv done !");
        }
    });
    

    // var new_csv = json2csv({data : newUser, fields:fields});
    // fs.writeFile('./test.csv',new_csv, function(err){
    //     if(err){
    //         res.json(err);
    //     }else{
    //         console.log(csv);
    //         res.json("write to csv done !");
    //     }

    // });

}



