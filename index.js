/**
 * Heirarchical conversation example
 */

'use strict';
var inquirer = require('inquirer');

var apis = []
var clients = []
var apiPrompts = [
  {
    name: 'name',
    message: 'API name (for reference only, this should be a valid string)'
  },
  {
    name: 'domain',
    message: 'The domain of the API (skip with Enter)'
  }
]

var anotherApiPrompt = {
  name: 'otherApi',
  message: 'Add another API?',
  type: 'confirm'
}
function main() {
  console.log('Create the APIs which the AuthService will interact with.');
  promptApis(apis);
}

function moreApis(apiCollection) {
  inquirer.prompt(anotherApiPrompt).then(confirm => {
    console.log(confirm)
    if (confirm.otherApi) {
      promptApis(apiCollection)
    } else {
      apis = apiCollection
      promptClients(clients)
    }
  })
}
function promptApis(apiCollection) {
  inquirer.prompt(apiPrompts).then(answers => {
    moreApis(Array.prototype.concat([], apiCollection, answers))
    // if (answers.direction === 'Forward') {
    //   console.log('You find yourself in a forest');
    //   console.log(
    //     'There is a wolf in front of you; a friendly looking dwarf to the right and an impasse to the left.'
    //   );
    //   encounter1();
    // } else {
    //   console.log('You cannot go that way. Try again');
    //   exitHouse();
    // }
  });
}

var clientPrompts = [
  {
    name: 'Type',
    type: 'list',
    choices: ['spa', 'webapp', 'api']
  }
]
function promptClients (clientCollection) {

}


function encounter1() {
  inquirer.prompt(directionsPrompt).then(answers => {
    var direction = answers.direction;
    if (direction === 'Forward') {
      console.log('You attempt to fight the wolf');
      console.log(
        'Theres a stick and some stones lying around you could use as a weapon'
      );
      encounter2b();
    } else if (direction === 'Right') {
      console.log('You befriend the dwarf');
      console.log('He helps you kill the wolf. You can now move forward');
      encounter2a();
    } else {
      console.log('You cannot go that way');
      encounter1();
    }
  });
}

function encounter2a() {
  inquirer.prompt(directionsPrompt).then(answers => {
    var direction = answers.direction;
    if (direction === 'Forward') {
      var output = 'You find a painted wooden sign that says:';
      output += ' \n';
      output += ' ____  _____  ____  _____ \n';
      output += '(_  _)(  _  )(  _ \\(  _  ) \n';
      output += '  )(   )(_)(  )(_) ))(_)(  \n';
      output += ' (__) (_____)(____/(_____) \n';
      console.log(output);
    } else {
      console.log('You cannot go that way');
      encounter2a();
    }
  });
}

function encounter2b() {
  inquirer
    .prompt({
      type: 'list',
      name: 'weapon',
      message: 'Pick one',
      choices: [
        'Use the stick',
        'Grab a large rock',
        'Try and make a run for it',
        'Attack the wolf unarmed'
      ]
    })
    .then(() => {
      console.log('The wolf mauls you. You die. The end.');
    });
}

main();


var directionsPrompt = {
  type: 'list',
  name: 'direction',
  message: 'Which direction would you like to go?',
  choices: ['Forward', 'Right', 'Left', 'Back']
};
