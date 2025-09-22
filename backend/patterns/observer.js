class Subject {
    constructor() {
      this.observers = [];
    }
    subscribe(observer) {
      this.observers.push(observer);
    }
    notify(data) {
      this.observers.forEach(o => o.update(data));
    }
  }
  
  class LoginLogger {
    update(data) {
      console.log('AUDITORÍA:', data);
    }
  }
  
  module.exports = { Subject, LoginLogger };