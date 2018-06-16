var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');
//var loginController = require('../controller/loginController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* ADD user */
router.post('/addUser', userController.addUser);

/* UPDATE user */
router.post('/updateUser/:id', userController.updateUser);

/* GET details of user */
router.get('/getUser/:id', userController.getUser);

/* DELETE user */
router.get('/deleteUser/:id', userController.deleteUser);

/* LOGIN user */
//router.post('/login', userController.loginUser);

/* LOGIN User Using Mongoose Model */
router.post('/login', userController.loginUserUsingMongooseModel);
//router.post('/login', loginController.loginUserUsingMongooseModel);

/* ADD User Using Mongoose Model */
router.post('/addUserUsingMongooseModel', userController.addUserUsingMongooseModel);

/* GET User Using Mongoose Model */
router.get('/getAllUsersUsingMongooseModel', userController.getAllUsersUsingMongooseModel);

/* GET user details using mongoose model */
router.get('/getUserDetailsUsingMonooseModel/:id', userController.getUserDetailsUsingMonooseModel);

/* UPDATE user using mongoose model */
router.post('/updateUserUsingMongooseModel/:id', userController.updateUserUsingMongooseModel);

/* UPLOAD file */
//router.post('/uploadFile',userController.fileUpload);

/* ADD Array Of Object Using mongoose */
router.post('/addMultipleObjectsWithinArray',userController.addMultipleObjectsWithinArray);

/* UPDATE Array Of Object Using mongoose */
router.post('/updateMultipleObjectsWithinArray/:id',userController.updateMultipleObjectsWithinArray);


// CRUD using JSON File:
router.get('/getAllUsersFromFile',userController.getAllUsersFromFile);
router.post('/addNewUserToJsonFile', userController.addNewUserToJsonFile);
router.get('/showDetailFromJsonFile/:id', userController.showDetailFromJsonFile);
router.delete('/deleteFromJsonFile/:id', userController.deleteFromJsonFile);

// CRUD on Array of json file
router.get('/deleteFromUserArrayFile', userController.deleteFromUserArrayFile);
router.post('/addObjectToArray', userController.addObjectToArray);

// Buffer routes
router.get('/cwrUsingBuffer', userController.cwrUsingBuffer);

// Third Party API calling
router.get('/whetherInformation', userController.whetherInformation);

// sent mail with sendgrid
router.get('/sendMailUsingSendgrid', userController.sendMailUsingSendgrid);

// READ CSV file data
router.get('/readDataFromCsvFile', userController.readDataFromCsvFile);

router.get('/writeDataToCsvFile', userController.writeDataToCsvFile);

module.exports = router;
