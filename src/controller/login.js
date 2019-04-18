const ApiBase = require('./apiBase.js');

module.exports = class extends ApiBase {
  indexAction() {
    var ctx = this.ctx;
    switch (ctx.method) {
      case 'GET':
        this.getAction();
        break;
      case 'POST':
        this.postAction();
        break;
      case 'PUT':
        this.putAction();
        break;
      case 'DELETE':
        this.deleteAction();
        break;
    }
  }
};