class Notification {
    send(message) {
      throw new Error('send() debe implementarse');
    }
  }
  
  class ConsoleEmail extends Notification {
    send(message) {
      console.log('NOTIFICACIÓN:', message);
    }
  }
  
  module.exports = { Notification, ConsoleEmail };