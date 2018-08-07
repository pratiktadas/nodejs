var express = require('express');
var router = express.Router();
var loginController = require('../controller/loginController');

router.post('/', loginController.loginUserUsingMongooseModel);

router.post('/uploadFile',loginController.uploadFile);

router.post('/addUserUsingMongooseModel', loginController.addUserUsingMongooseModel);

router.get('/asynchSeriesExample',loginController.asynchSeriesExample);

router.get('/cropImageUsingMg',loginController.cropImageUsingMg);

router.get('/resizeImageUsingMg',loginController.resizeImageUsingMg)

router.get('/extractsAllPropertiesOfImage',loginController.extractsAllPropertiesOfImage);

module.exports = router;