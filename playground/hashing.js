// manual encryotion
// const {SHA256} = require('crypto-js');

// let message = 'i am whatever';
// let hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);


// let data = {
//   id: 4
// };

// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('data was NOT changed');
// } else {
//   console.log('data was changed DO NOT TRUST');
// }


//however JSON web tokens does all of this for you
// const jwt = require('jsonwebtoken');


// let data = {
//   id: 10
// };


// let token = jwt.sign(data, '123abc');
// console.log(token);

// let decoded = jwt.verify(token, '123abc');
// console.log(decoded);







// salting passwords
const bcrypt = require('bcryptjs');

let password = '123456';

bcrypt.genSalt(10, (error, salt) => {
  bcrypt.hash(password, salt, (error, hash) => {
    console.log(hash);
  });
});

let hashedPassword = '$2a$10$XLdmTf.q19m.ZMIcxiv2FevU8kamxNu6IU4OjsVaDdqpYB.rErYhW';

bcrypt.compare('123', hashedPassword, (error, result) => {
  console.log(result);
});
