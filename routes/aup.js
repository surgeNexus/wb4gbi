const express = require('express');
const router = express.Router();
const fs = require('fs');
const middleware = require('../middleware/index');
const Repeater = require('../models/Repeater');

router.get('/', (req, res) => {
    Repeater.find({}, (err, foundRepeaters) => {
        if(err){console.log(err); res.redirect('back')}
        const path = './public/files/WB4GBI_AUP.pdf'
        if (fs.existsSync(path)) {
            res.contentType("application/pdf");
            fs.createReadStream(path).pipe(res)
        } else {
            res.status(500)
            console.log('File not found')
            res.send('File not found')
        }
    });
});

module.exports = router;
