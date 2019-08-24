const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'myencryptionpassword';

module.exports = text => {
  let decipher = crypto.createDecipher(algorithm,password)
  let dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
};