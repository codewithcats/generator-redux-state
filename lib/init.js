const templatePath = require('./templatePath')

/**
 * Intialize state and router directories
 *
 * @param {Generator} generator          Generator instance
 * @param {boolean} generateEditableFiles
 *
 */
module.exports = function init(generator, generateEditableFiles = false) {

  generator.log('Initilaizing...')

  if (generateEditableFiles) {
    generator.fs.copy(
      templatePath('init/state/initialState.js'),
      generator.destinationPath('src/state/initialState.js')
    )

    generator.fs.copy(
      templatePath('init/.flowconfig'),
      generator.destinationPath('.flowconfig')
    )

    generator.fs.copyTpl(
      templatePath('init/router/index.js'),
      generator.destinationPath('src/router/index.js'),
      {}
    )

  }

  generator.fs.copyTpl(
    templatePath('stateTypes.ejs'),
    generator.destinationPath(`src/state/common.type.js`),
    generator.meta
  )

  generator.fs.copyTpl(
    templatePath('store.ejs'),
    generator.destinationPath('src/state/store.js'),
    generator.meta
  )

}
