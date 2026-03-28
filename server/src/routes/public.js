const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validateRequest');

router.get('/:username/:slug', controller.getEventInfo);
router.get('/:username/:slug/slots', controller.getSlots);
router.post('/:username/:slug/book', validateBooking, controller.book);

module.exports = router;
