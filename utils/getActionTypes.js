const _ = require('lodash')

module.exports = function(meta, state) {
  const types = _.map(meta.states[state].actions, (act => act.type))
  return types
}
