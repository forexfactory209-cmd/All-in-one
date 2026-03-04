const express = require('express');
const router = express.Router();
const propertiesController = require('./properties.controller');
const validate = require('../../middleware/validate.middleware');
const { propertySchema } = require('../../utils/validation.schemas');

router.get('/', propertiesController.getAllProperties);
router.get('/:id', propertiesController.getPropertyById);
router.post('/', validate(propertySchema), propertiesController.createProperty);
router.put('/:id', validate(propertySchema), propertiesController.updateProperty);
router.delete('/:id', propertiesController.deleteProperty);

module.exports = router;
