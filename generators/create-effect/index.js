const StateGenerator = require('../StateGenerator')
const _ = require('lodash')

module.exports = class CreateEffect extends StateGenerator {

  constructor(args, opts) {
    super(args, opts)
  }

  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'stateName',
        message: 'Select a state:',
        choices: this.states,
      },
      {
        type: 'input',
        name: 'effectName',
        message: 'Enter effect name:',
      },
    ])
    .then(answers => {
      this.answers = answers
    })
  }

  writing() {
    const {stateName, effectName} = this.answers

    _.set(this.meta, `states.${stateName}.effects.${effectName}`, {
      name: effectName,
    })
    this.updateMeta()

    this.fs.copyTpl(
      this.templatePath('effect.ejs'),
      this.destinationPath(`src/state/${stateName}/effects/${effectName}.js`),
      {effect: effectName,}
    )

    this.fs.copyTpl(
      this.templatePath('effectIndex.ejs'),
      this.destinationPath(`src/state/${stateName}/effects/index.js`),
      {effects: this.getEffects(stateName), state: stateName,}
    )

    this.fs.copyTpl(
      this.templatePath('../../../templates/store.ejs'),
      this.destinationPath('src/state/store.js'),
      this.meta
    )
  }
}
