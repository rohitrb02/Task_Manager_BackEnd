const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;  
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Connect to the database
connectDB();

// Express session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_default_secret',  // Use an environment variable
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use(cors()); // Allow requests from React app
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,  
    callbackURL: "/api/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    // Handle user data here (find or create user in your database)
    return done(null, profile);
  }
));

// Serialize and deserialize user
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Port and server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
