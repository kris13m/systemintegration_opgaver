const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Dummy acc
const fakeUser = {
  id: 1,
  username: 'test',
  password: '1234' 
};

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(new LocalStrategy((username, password, done) => {
  if (username === fakeUser.username && password === fakeUser.password) {
    return done(null, fakeUser);
  } else {
    return done(null, false, { message: 'Incorrect credentials' });
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  if (id === fakeUser.id) done(null, fakeUser);
  else done(null, false);
});

/* Routes
app.get('/', (req, res) => {
  res.send(req.isAuthenticated() ? `Hello, ${req.user.username}` : 'Not logged in');
});*/

app.get('/', (req, res) => {
  res.send(`<form method="post" action="/login">
    <input name="username" placeholder="Username" /><br/>
    <input name="password" type="password" placeholder="Password" /><br/>
    <button type="submit">Login</button>
  </form>`);
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));