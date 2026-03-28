const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventTypeController');
const { validateEventType } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.post('/', validateEventType, controller.create);
router.put('/:id', validateEventType, controller.update);
router.patch('/:id/toggle', controller.toggleActive);
router.delete('/:id', controller.delete);

module.exports = router;
