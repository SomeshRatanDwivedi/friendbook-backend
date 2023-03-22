const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send("<h1>V1</h1>")
})


router.use('/users', require('./users'));

router.use('/posts', require('./post'));

router.use('/friendship', require('./friendship'));

router.use('/likes', require('./like'))

router.use('/comments', require('./comment'));

router.use('/conversation', require('./conversation'));
router.use('/message', require('./message'));

router.use('/notifications', require('./notifications'))




























module.exports = router;