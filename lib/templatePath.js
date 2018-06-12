const path = require('path')

/**
 * Resolve template path
 *
 * @param {string} p Template path inside `lib/templates/` directory
 *
 * @return {string}
 */
module.exports = function templatePath(p) {
  return path.resolve(__dirname, 'templates', p)
}
