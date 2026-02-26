const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');

router.get('/', (req, res) => usersController.getAll(req, res));
router.post('/', (req, res) => usersController.create(req, res));
router.get('/:id', (req, res) => usersController.getProfile(req, res));
router.put('/:id', (req, res) => usersController.updateProfile(req, res));
router.delete('/:id', (req, res) => usersController.delete(req, res));

module.exports = router;
