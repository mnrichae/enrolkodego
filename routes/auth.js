const express = require('express');
const router = express.Router();
const regController = require('../controllers/authAccount')

router.post('/login', regController.login)
router.post('/register', regController.register)
router.get('/delete/:email', regController.delete)
router.get('/update-form/:email', regController.update)
router.post('/update-user', regController.updateUser)
router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.render('index');
});
module.exports = router;