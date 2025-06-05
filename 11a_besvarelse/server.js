// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const app = express();
const PORT = 8080;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

let currentUser = null; // Variable to store the logged-in user

// Session setup
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  currentUser = profile;  // Store user in memory
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes for the API
app.get('/', (req, res) => {
  if (currentUser) {
    res.send(`
      <h1>Hello, ${currentUser.displayName}!</h1>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>Login with Google</h1>
      <button onclick="window.location.href='/auth/google'">Login with Google</button>
    `);
  }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

app.get('/logout', (req, res) => {
  currentUser = null;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});