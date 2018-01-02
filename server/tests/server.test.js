const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


todos = [{
  text: "first test todo"
}, {
  text: "second test todo"
}];


//however in our test we assume that there is nothing in the DB
//most of the time there will actually be data in DB
//so we must run:
beforeEach((done) => {
  Todo.remove({}).then(() => {
    // console.log('removed everything from DB before test');
    // now however we include test todos (seeds)
    return Todo.insertMany(todos);
  }).then(() => {
    // chaining commands here because returning todos up there
    done();
  });
});
//this says: before each test remove everything and add the two seeds

describe('POST /todos', () => {


  it('should create a new todo', (done) => {
    let text = 'test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });



  it('should not create a new todo if bad data passed', (done) => {
    let badText = '';

    request(app)
      .post('/todos')
      .send({badText})
      .expect(400)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });


});



describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
