require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');


let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//create in rails
app.post('/todos', (request, response) => {
  // console.log(request.body);
  let todo = new Todo({
    text: request.body.text
  });

  todo.save().then((doc) => {
    response.send(doc);
  }, (error) => {
    response.status(400).send(error);
  });
});

//index in rails
app.get('/todos', (request, response) => {
  Todo.find().then((todos) => {
    // response.send(todos);
    // the above code works but it will return an array of todos
    // by explicitly returning an object it will be more customizable later
    // thus:
    response.send({todos});
  }, (error) => {
    response.status(400).send(error);
  });
});


//show in rails
app.get('/todos/:id', (request, response) => {
  let id = request.params.id;
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({todo});
  }).catch((error) => {
    response.status(400).send();
  });
});


//destroy in rails (or delete?)
app.delete('/todos/:id', (request, response) => {
  let id = request.params.id;
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({todo});
  }).catch((error) => {
    response.status(400).send();
  })
});


//update in rails
app.patch('/todos/:id', (request, response) => {
  let id = request.params.id;
  let body = _.pick(request.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({todo});
  }).catch((error) => {
    response.status(400).send();
  });
});




//user authentication--------------
//sign-up
app.post('/users', (request, response) => {
  let body = _.pick(request.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    // response.send({user});
  }).then((token) => {
    response.header('x-auth', token).send(user);
  }).catch((error) => {
    response.status(400).send(error);
  });
});


//using middleware function called authenticate
//./middleware/authenticate.js
app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user);
});


//sign-in
app.post('/users/login', (request, response) => {
  let body = _.pick(request.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    // response.send(user);
    return user.generateAuthToken().then((token) => {
      response.header('x-auth', token).send(user);
    });
  }).catch((error) => {
    response.status(400).send();
  });
});




app.listen(port, () => {
  console.log(`started app on port ${port}`);
});



module.exports = {
  app
};









//--------------------------------------------
//model validations
//moved to separate files in models folder




// //create new instance of model
// let newTodo = new Todo({
//   text: 'cook dinner',
//   completed: false,
// });

// //creating new instance of a model alone does not insert in into DB
// //we must use the save function
// newTodo.save().then((doc) => {
//   console.log('saved todo task');
//   console.log(doc);
// }, (error) => {
//   console.log('unable to save todo task', error);
// });


// let newUser = new User({
//   email: 'blah@hhhhhhhh.cmo'
// });

// newUser.save().then((doc) => {
//   console.log('user saved');
//   console.log(doc);
// }, (error) => {
//   console.log('unable to save', error);
// });

//random note
