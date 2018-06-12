const _ = require('lodash')
const StateGenerator = require('../StateGenerator')

module.exports = class CreateAction extends StateGenerator {

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
        name: 'actionName',
        message: 'Enter action name:',
      },
    ])
    .then(answers => {
      this.answers = answers
    })
  }

  writing() {
    const {stateName, actionName} = this.answers
    const actionType = _.snakeCase(actionName).toUpperCase()
    const actionTypeWithNamespace = `${stateName}/${actionType}`

    if (!this.meta.states[stateName]) {
      this.log(`No state [${stateName}] found. Aborted.`)
      return
    }

    _.set(
      this.meta, `states.${stateName}.actions.${actionName}`,
      {name: actionName, type: actionTypeWithNamespace}
    )
    this.updateMeta()

    this.fs.copyTpl(
      this.templatePath('action.ejs'),
      this.destinationPath(`src/state/${stateName}/actions/${actionName}.js`),
      {action: actionName, type: actionType, fullType: actionTypeWithNamespace}
    )

    this.fs.copyTpl(
      this.templatePath('actionIndex.ejs'),
      this.destinationPath(`src/state/${stateName}/actions/index.js`),
      {actions: this.getActions(stateName), state: stateName}
    )
  }
}
