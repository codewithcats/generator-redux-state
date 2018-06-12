const Generator = require('yeoman-generator')

module.exports = class App extends Generator {

  constructor(args, opts) {
    super(args, opts)

    this.option('install', {
      desc: 'Skip dependencies installation',
      type: Boolean,
      default: false,
    })
  }

  install() {
    if (this.options.install) {
      this.yarnInstall(
        ['redux', 'redux-saga', 'router5', 'redux-router5']
      )
      this.yarnInstall(
        ['flow-bin'], {dev: true}
      )
    }
  }

  writing() {
    const meta = {
      states: {},
    }

    this.fs.writeJSON(
      this.destinationPath('src/state/.state/meta.json'),
      meta
    )

    this.fs.copy(
      this.templatePath('state/initialState.js'),
      this.destinationPath('src/state/initialState.js')
    )

    this.fs.copyTpl(
      this.templatePath('../../../templates/stateTypes.ejs'),
      this.destinationPath(`src/state/common.type.js`),
      meta
    )

    this.fs.copyTpl(
      this.templatePath('../../../templates/store.ejs'),
      this.destinationPath('src/state/store.js'),
      meta
    )

    this.fs.copyTpl(
      this.templatePath('router/index.js'),
      this.destinationPath('src/router/index.js'),
      {}
    )

    this.fs.copy(
      this.templatePath('.flowconfig'),
      this.destinationPath('.flowconfig')
    )
  }

}
