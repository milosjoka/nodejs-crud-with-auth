const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const AuthController = require('../../controllers/auth.controller');
const Joi = require('joi');
const router = express.Router();
const passport = require('../../middlewares/passport.middleware');

const validationSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required()
});

// Login
router.post('/login', validator.body(validationSchema, { joi: { convert: true, allowUnknown: false } }),
    passport.authenticate('local', { session: false }),
    AuthController.login);

module.exports = router;
