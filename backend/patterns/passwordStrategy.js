class SimplePassword {
    validate(password) {
      return password.length >= 6;
    }
  }
  
  class StrongPassword {
    validate(password) {
      return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
    }
  }
  
  module.exports = { SimplePassword, StrongPassword };
  