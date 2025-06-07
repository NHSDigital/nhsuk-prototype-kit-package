// This Express middleware function sets some
// HTTP headers which should only be set in deployed
// environments
function productionHeaders(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    // Set Strict-Transport-Security header to
    // ensure that browsers only use HTTPS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Set content security policy to upgrade
    // all HTTP requests to HTTPS
    res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');

    // Redirect HTTP requests to HTTPS
    if (req.protocol !== 'https') {
      res.redirect(302, `https://${req.get('Host')}${req.url}`);
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = productionHeaders;
