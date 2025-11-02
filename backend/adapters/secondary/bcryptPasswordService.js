const IPasswordService = require('../../core/ports/iPasswordService');
const bcrypt = require('bcrypt');

class BcryptPasswordService extends IPasswordService {
  async hash(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = BcryptPasswordService;