const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');

const authController = require('../controllers/authController');

const router = express.Router();

// @route    POST /api/auth/register
// @desc     Register user
// @access   Public
router.post(
    '/register',
    [
        check('firstName', 'Name is required').not().isEmpty(),
        check('lastName', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
        check('confirmPassword', 'Password must be 6 or more characters').isLength({ min: 6 }),
    ],
    authController.registerUser
);

// @route    POST /api/auth/login
// @desc     Login user
// @access   Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.loginUser
);

// Route to start Google authentication
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google callback route
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }), 
    (req, res) => {
        res.redirect('/dashboard');  
    }
);

module.exports = router;
