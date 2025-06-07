const automaticRouting = require('./auto-routing');
const resetSessionData = require('./reset-session-data');
const autoStoreData = require('./auto-store-data');
const nunjucksFilters = require('./nunjucks-filters');
const authenticate = require('./authentication');
const productionHeaders = require('./production-headers');

const NHSPrototypeKit = function (req, res, next) {

  productionHeaders(req, res, function() {
    authenticate(req, res, function() {
      resetSessionData(req, res, function() {
        autoStoreData(req, res, function() {
          automaticRouting.matchRoutes(req, res, function() {
            next()
          })
        })
      })
    })
  })
}

NHSPrototypeKit.nunjucksFilters = nunjucksFilters

module.exports = NHSPrototypeKit
