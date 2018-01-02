const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


let app = express();

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

app.listen(3000, () => {
  console.log('started on port 3000');
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
