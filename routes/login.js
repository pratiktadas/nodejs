var express = require('express');
var router = express.Router();
var loginController = require('../controller/loginController');

router.post('/', loginController.loginUserUsingMongooseModel);

router.post('/uploadFile',loginController.uploadFile);

router.post('/addUserUsingMongooseModel', loginController.addUserUsingMongooseModel);

module.exports = router;