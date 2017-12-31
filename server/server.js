const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

//model validations
let Todo = mongoose.model('Todo', {
  text: {
    //even if type is String, if you put boolean or number when
    //creating new instance, it will still work because it will wrap input in quotes
    //something to be cautious of
    type: String,
    required: true,
    minLength: 1,
    //trim will trim trailing and preceeding white spaces
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
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
