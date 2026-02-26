const express = require('express');
const router = express.Router();
const disputesController = require('./disputes.controller');

router.get('/', disputesController.getAllDisputes);
router.get('/:id', disputesController.getDisputeById);
router.post('/', disputesController.createDispute);
router.patch('/:id/status', disputesController.updateStatus);

module.exports = router;
