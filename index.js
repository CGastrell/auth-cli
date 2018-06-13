var inquirer = require('inquirer')

var prompts = {
  api: [
    {
      name: 'name',
      message: 'API name (for reference only, this should be a valid string)'
    },
    {
      name: 'domain',
      message: 'The domain of the API (skip with Enter)'
    }
  ],
  otherApi: {
    name: 'otherApi',
    message: 'Add another API?',
    type: 'confirm'
  },
  client: {
    name: {
      name: 'name',
      message: 'Give the client a name. Use simple characters, including spaces'
    },
    type: {
      name: 'type',
      message: 'Where are you going to use this client?',
      type: 'list',
      choices: ['spa', 'webapp', 'api']
    },
    callbackURL: {
      name: 'callbackURL',
      message: 'Add a callback URL for your SPA'
    },
    allowTwoFactor: {
      name: 'twoFactor',
      type: 'confirm',
      message: 'Enable 2fa authentication on your client?'
    }
  }
}
var APIS = []
const CLIENT = {
  DEFAULTS: {
    name: '',
    type: '',
    key: '',
    secret: '',
    domain: '',
    callbackURL: '',
    refreshToken: false,
    skipAuthorization: false,
    allowTwoFactor: false,
    jwtExpTime: 1800,
    grants: [],
    apps: [],
    disclaimer: [{
      title: 'Request auth access',
      details: 'This app is requesting access to your account\'s basic profile data.'
    }],
    roles: []
  },
  SPA: {
    grants: ['implicit']
  },
  WEB: {
    skipAuthorization: true,
    refreshToken: true,
    grants: ['implicit', 'refresh-token', 'client-credentials']
  },
  API: {
    skipAuthorization: true,
    refreshToken: true,
    grants: ['refresh-token', 'client-credentials']
  }
}

function main () {
  console.log('Create the APIs which the AuthService will interact with.')
  promptApis(APIS)
}

function promptApis (apiCollection) {
  inquirer.prompt(prompts.api).then(answers => {
    moreApis(Array.prototype.concat([], apiCollection, answers))
  })
}

function moreApis (apiCollection) {
  inquirer.prompt(prompts.otherApi).then(confirm => {
    if (confirm.otherApi) {
      promptApis(apiCollection)
    } else {
      APIS = apiCollection
      console.log('\nCreate auth clients for your AuthService. The client is the authorization consumer for your APIs')
      promptClients()
    }
  })
}
function promptClients () {
  inquirer.prompt(prompts.client.name).then(answer => {
    CLIENT.DEFAULTS.name = answer.name
    promptClientType()
  })
}
function promptClientType () {
  inquirer.prompt(prompts.client.type).then(answer => {
    CLIENT.DEFAULTS.type = answer.type
    switch (answer.type) {
      case 'spa':
        CLIENT.RESULT = Object.assign({}, CLIENT.DEFAULTS, CLIENT.SPA)
        break
      case 'webapp':
        CLIENT.RESULT = Object.assign({}, CLIENT.DEFAULTS, CLIENT.WEB)
        break
      case 'api':
        CLIENT.RESULT = Object.assign({}, CLIENT.DEFAULTS, CLIENT.API)
        break
      default: throw new Error()
    }

    if (answer.type === 'spa' || answer.type === 'webapp') {
      promptClientCallbackUrl()
    } else {
      showResult()
    }
  })
}
function promptClientCallbackUrl () {
  inquirer.prompt(prompts.client.callbackURL).then(answer => {
    CLIENT.RESULT.callbackURL = answer.callbackURL
    promptClientTwoFactor()
  })
}
function promptClientTwoFactor () {
  inquirer.prompt(prompts.client.allowTwoFactor).then(confirm => {
    CLIENT.RESULT.allowTwoFactor = confirm.twoFactor
    if (confirm.twoFactor) {
      CLIENT.RESULT.grants.push('two-factor')
    }
    showResult()
  })
}
function showResult () {
  console.log(APIS)
  console.log(CLIENT.RESULT)
}
main()
