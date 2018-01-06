let {User} = require('./../models/user');

let authenticate = (request, response, next) => {
  let token = request.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
      // instead of doing: return response.status(401).send();
      // which is redundant
      // we can return a rejected promise so that it will imediately jump to catch error
    }

    request.user = user;
    request.token = token;
    next();
  }).catch((error) => {
    response.status(401).send();
  });
};

module.exports = {
  authenticate
};
