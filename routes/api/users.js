const Joi = require('joi');
const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const UserController = require('../../controllers/user.controller');

const router = express.Router();

// Gets suggested Users
router.get('/', UserController.getAutoSuggested);

// Get Single User
router.get('/:id', UserController.getById);

const validationSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().min(2).regex(/^(?=\D*\d)(?=\d*\D)[a-zA-Z0-9]+$/).required(),
    // Regex comment:
    // ^ - start of a string
    // (?=\D*\d) - a positive lookahead requiring a digit after 0 or more non-digit symbols
    // (?=\d*\D) - a positive lookahead requiring a non digit after 0 or more digit symbols
    // [a-zA-Z0-9]+ - 1 or more alphanumeric chars
    // $ - end of string.
    age: Joi.number().greater(4).less(130).required()
});

// Create User
router.post('/', validator.body(validationSchema, { joi: { convert: true, allowUnknown: false } }), UserController.create);

// Update User
router.put('/:id', validator.body(validationSchema, { joi: { convert: true, allowUnknown: false } }), UserController.update);

// Delete User
router.delete('/:id', UserController.delete);


module.exports = router;
