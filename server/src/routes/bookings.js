const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.patch('/:id/cancel', controller.cancel);
router.post('/:id/reschedule', controller.reschedule);

module.exports = router;
