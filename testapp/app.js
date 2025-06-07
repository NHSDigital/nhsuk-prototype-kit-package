const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const app = express()
const path = require('path');
const nunjucks = require('nunjucks');
const session = require('express-session')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = 3000

const appViews = [
  path.join(__dirname, 'views/'),
  path.join(__dirname, 'node_modules/nhsuk-prototype-kit/lib/views/'),
  path.join(__dirname, 'node_modules/nhsuk-frontend/packages/components'),
  path.join(__dirname, 'node_modules/nhsuk-frontend/packages/macros'),
  path.join(__dirname, 'node_modules/nhsuk-frontend/packages'),
];

const nunjucksConfig = {
  autoescape: true,
  noCache: true,
};

nunjucksConfig.express = app;

let nunjucksAppEnv = nunjucks.configure(appViews, nunjucksConfig);

NHSPrototypeKit.nunjucksFilters.addAll(nunjucksAppEnv)

// Support for parsing data in POSTs
// TODO: see if this can be moved to dependency
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Use session
// TODO: see if this can be moved to dependency
app.use(session({
  secret: 'nhsuk-prototype-kit',
  resave: false,
  saveUninitialized: true
}))

// Use cookie middleware to parse cookies
// TODO: see if this can be moved to dependency
app.use(cookieParser());

app.set('view engine', 'html');

app.use('/', express.static(path.join(__dirname, 'static')))

app.use(NHSPrototypeKit)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
