const ViewBase = require('./viewBase.js');

module.exports = class extends ViewBase {
  indexAction() {
    return this.display();
  }
};
