const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/list', (req, res) => {
    res.render('list');
});

// router.get('/update-form', (req, res) => {
//     res.render('update-form');
// });

router.get('/update-user', (req, res) => {
    res.render('update-user');
});


module.exports = router;