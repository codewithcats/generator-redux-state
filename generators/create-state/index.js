const _ = require('lodash')
const Generator = require('yeoman-generator')

module.exports = class CreateState extends Generator {

  constructor(args, opts) {
    super(args, opts)

  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'stateName',
        message: 'Enter state name:',
      },
    ])
    .then(answers => {
      this.answers = answers
    })
  }

  writing() {
    const {stateName} = this.answers
    const stateType = `${_.capitalize(_.camelCase(stateName))}State`
    const metaPath = this.destinationPath('src/state/.state/meta.json')
    const meta = this.fs.readJSON(metaPath)

    if (meta.states[stateName]) {
      this.log(`State [${stateName}] already been created. Aborted.`)
      return
    }

    meta.states[stateName] = {
      // TODO: add state content
      actions: {},
      channels: {},
      effects: {},
      reducers: {},
    }

    this.fs.writeJSON(metaPath, meta)

    this.fs.copyTpl(
      this.templatePath('actions/index.ejs'),
      this.destinationPath(`src/state/${stateName}/actions/index.js`),
      {
        stateName,
      }
    )

    this.fs.copyTpl(
      this.templatePath('channels/index.ejs'),
      this.destinationPath(`src/state/${stateName}/channels/index.js`),
      {
        stateName,
      }
    )

    this.fs.copyTpl(
      this.templatePath('effects/index.ejs'),
      this.destinationPath(`src/state/${stateName}/effects/index.js`),
      {
        stateName,
      }
    )

    this.fs.copyTpl(
      this.templatePath('reducers/initialState.ejs'),
      this.destinationPath(`src/state/${stateName}/reducers/initialState.js`),
      {
        stateType,
      }
    )

    this.fs.copyTpl(
      this.templatePath('../../../templates/reducers/index.ejs'),
      this.destinationPath(`src/state/${stateName}/reducers/index.js`),
      {
        stateName,
        stateType,
        actions: [],
      }
    )

    this.fs.copyTpl(
      this.templatePath('type.ejs'),
      this.destinationPath(`src/state/${stateName}/type.js`),
      {
        stateType,
      }
    )

    this.fs.copyTpl(
      this.templatePath('../../../templates/store.ejs'),
      this.destinationPath('src/state/store.js'),
      meta
    )

  }

  end() {
    this.answers = {}
  }
}
