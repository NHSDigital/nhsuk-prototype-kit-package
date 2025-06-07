/**
 * Check string starts with a value
 *
 * @example startsWith('NHS England', 'NHS') // true
 * @param {string} string - String to check
 * @param {string} value - Value to check against
 * @returns {boolean} Returns `true` if `string` starts with `value`, else `false`
 */
function startsWith(string, value) {
  return string.startsWith(value)
}

// Output the data in the browser’s JavaScript console
function log(data) {
  const safe = this.env.getFilter('safe')
  return safe(`<script>console.log(${JSON.stringify(data, null, '\t')});</script>`);
}

// Use this to add all the filters at once
function addAll(nunjucksEnv) {
  nunjucksEnv.addFilter('startsWith', startsWith)
  nunjucksEnv.addFilter('log', log)
}

module.exports = {
  startsWith,
  log,
  addAll
}
