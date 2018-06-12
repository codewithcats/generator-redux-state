const _ = require('lodash')
const StateGenerator = require('../StateGenerator')
const init = require('../../lib/init')

module.exports = class Regenerate extends StateGenerator {

  constructor(args, opts) {
    super(args, opts)

    this.option('install', {
      desc: 'Skip dependencies installation',
      type: Boolean,
      default: false,
    })
  }

  prompting() {
    this.log('Regenerating all files based on current database.')
    return this.prompt([
      {
        type: 'confirm',
        name: 'regenEditableFiles',
        message: 'Do you want to recreate editable files? All changes will be lost.',
        default: false,
      },
    ])
    .then(answers => {
      this.answers = answers
    })
  }

  writing() {
    this.log(this.meta)
    // do [app]
    init(this, this.answers.regenEditableFiles)
    // do [create-state]
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
}
