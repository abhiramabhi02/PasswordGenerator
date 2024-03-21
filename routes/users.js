const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/registration', userController.userRegistration)

router.post('/login',userController.userLogin)

router.post('/getpassword', userController.getPasswords)

router.post('/generatepassword', userController.generatePass)

module.exports = router;
