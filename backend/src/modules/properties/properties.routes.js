const express = require('express');
const router = express.Router();
const propertiesController = require('./properties.controller');

// Public or Protected routes - for now focused on admin panel functionality
router.get('/', propertiesController.getAllProperties);
router.get('/:id', propertiesController.getPropertyById);
router.post('/', propertiesController.createProperty);
router.put('/:id', propertiesController.updateProperty);
router.delete('/:id', propertiesController.deleteProperty);

module.exports = router;
