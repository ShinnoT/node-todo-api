const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


let app = express();




app.listen(3000, () => {
  console.log('started on port 3000');
});














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
