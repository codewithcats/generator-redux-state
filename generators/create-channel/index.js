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
        name: 'channelName',
        message: 'Enter channel name:',
      },
    ])
    .then(answers => {
      this.answers = answers
    })
  }

  writing() {
    const {stateName, channelName} = this.answers

    _.set(this.meta, `states.${stateName}.channels.${channelName}`, {
      name: channelName,
    })
    this.updateMeta()

    this.fs.copyTpl(
      this.templatePath('channel.ejs'),
      this.destinationPath(`src/state/${stateName}/channels/${channelName}.js`),
      {channel: channelName,}
    )

    this.fs.copyTpl(
      this.templatePath('channelIndex.ejs'),
      this.destinationPath(`src/state/${stateName}/channels/index.js`),
      {channels: this.getChannels(stateName), state: stateName}
    )
  }
}
