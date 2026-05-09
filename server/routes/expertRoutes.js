const express = require('express');
const router = express.Router();
const { getExperts, getExpert, createExpert } = require('../controllers/expertController');

router.get('/', getExperts);
router.get('/:id', getExpert);
router.post('/', createExpert);

module.exports = router;
