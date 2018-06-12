const _ = require('lodash')
const StateGenerator = require('../StateGenerator')
const getMetaPath = require('../../utils/getMetaPath')
const getActions = require('../../utils/getActions')

module.exports = class CreateReducer extends StateGenerator {

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
    ])
    .then(answers => {
      this.answers = answers
      const actions = this.getActions(answers.stateName)
      return this.prompt([
        {
          type: 'list',
          name: 'actionName',
          message: 'Select an action:',
          choices: Object.keys(actions),
        },
      ])
    })
    .then(answers => {
      this.answers = {
        ...this.answers,
        ...answers,
      }
    })
  }

  writing() {
    const {stateName, actionName} = this.answers
    const stateType = `${_.capitalize(_.camelCase(stateName))}State`

    _.set(
      this.meta, `states.${stateName}.reducers.${actionName}`,
      {name: actionName}
    )
    this.updateMeta()

    this.fs.copyTpl(
      this.templatePath('../../../templates/reducers/reducer.ejs'),
      this.destinationPath(`src/state/${stateName}/reducers/${actionName}.js`),
      {reducerName: actionName, stateType, actionName}
    )

    const actions = this.getActions(stateName)
    const reducers = this.getReducers(stateName)
    const actionsWithReducer = _.map(reducers, r => {
      return actions[r.name]
    })

    this.fs.copyTpl(
      this.templatePath('../../../templates/reducers/index.ejs'),
      this.destinationPath(`src/state/${stateName}/reducers/index.js`),
      {actions: actionsWithReducer, stateName, stateType}
    )
  }
}
