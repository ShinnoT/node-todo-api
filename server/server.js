const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

//model validations
let Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});


//create new instance of model
let newTodo = new Todo({
  text: 'cook dinner',
  completed: false,
});

//creating new instance of a model alone does not insert in into DB
//we must use the save function
newTodo.save().then((doc) => {
  console.log('saved todo task');
  console.log(doc);
}, (error) => {
  console.log('unable to save todo task', error);
});
