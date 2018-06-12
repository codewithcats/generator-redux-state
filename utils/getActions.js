module.exports = function(meta, stateName) {
  return Object.keys(meta.states[stateName].actions)
}
