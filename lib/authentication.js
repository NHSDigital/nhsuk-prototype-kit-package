const url = require('url');
const crypto = require('crypto');

const password = process.env.PROTOTYPE_PASSWORD;

const encryptPassword = function(password) {
  if (!password) { return undefined; }
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

const allowedPathsWhenUnauthenticated = [
  '/prototype-admin/password',
  '/css/main.css',
  '/nhsuk-frontend/nhsuk.min.js',
  '/js/auto-store-data.js',
  '/js/main.js',
];

const encryptedPassword = encryptPassword(process.env.PROTOTYPE_PASSWORD);

// Redirect the user to the password page, with
// the current page path set as the returnURL in a query
// string so the user can be redirected back after successfully
// entering a password
function sendUserToPasswordPage(req, res) {
  const returnURL = url.format({
    pathname: req.path,
    query: req.query,
  });
  const passwordPageURL = url.format({
    pathname: '/prototype-admin/password',
    query: { returnURL },
  });
  res.redirect(passwordPageURL);
}

// Give the user some instructions on how to set a password
function showNoPasswordError(res) {
  return res.send('<h1>Error:</h1><p>Password not set. <a href="https://prototype-kit.service-manual.nhs.uk/how-tos/publish-your-prototype-online">See guidance for setting a password</a>.</p>');
}

const passwordRoute = function (req, res, next) {
  const { path, method } = req

  if (method === 'GET' && path === '/prototype-admin/password') {
    res.render('password');
  } else {
    next()
  }
}


function authenticate(req, res, next) {
  if (!process.env.PROTOTYPE_PASSWORD) {
    showNoPasswordError(res);
  } else if (allowedPathsWhenUnauthenticated.includes(req.path)) {
    next();
  } else if (req.cookies.authentication === encryptedPassword) {
    next();
  } else {
    sendUserToPasswordPage(req, res);
  }
}

// Check authentication password
const checkSubmittedPassword = function(req, res) {
  const submittedPassword = req.body.password;
  const { returnURL } = req.body;

  if (submittedPassword === password) {
    res.cookie('authentication', encryptPassword(password), {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: 'None', // Allows GET and POST requests from other domains
      httpOnly: true,
      secure: true,
    });
    res.redirect(returnURL);
  } else {
    res.redirect(`/prototype-admin/password?error=wrong-password&returnURL=${encodeURIComponent(returnURL)}`);
  }
};

const renderPasswordPage = function(req, res) {
  const returnURL = req.query.returnURL || '/';
  const { error } = req.query;
  res.render('password', {
    returnURL,
    error,
  });
}

function authentication(req, res, next) {
  const { path, method } = req

  if (process.env.NODE_ENV !== 'production') {
    next()
  } else if (!process.env.PROTOTYPE_PASSWORD) {
    showNoPasswordError(res);
  } else if (method === 'GET' && path === '/prototype-admin/password') {
    renderPasswordPage(req, res)
  } else if (method === 'POST' && path === '/prototype-admin/password')  {
    checkSubmittedPassword(req, res)
  } else if (allowedPathsWhenUnauthenticated.includes(req.path)) {
    next();
  } else if (req.cookies.authentication === encryptedPassword) {
    next();
  } else {
    sendUserToPasswordPage(req, res);
  }
}

module.exports = authentication;
