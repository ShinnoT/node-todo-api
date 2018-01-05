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
const jwt = require('jsonwebtoken');


let data = {
  id: 10
};


let token = jwt.sign(data, '123abc');
console.log(token);

let decoded = jwt.verify(token, '123abc');
console.log(decoded);
