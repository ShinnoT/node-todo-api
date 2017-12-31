const mongoose = require('mongoose');

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

module.exports = {
  Todo
};
