module.exports = class extends think.Controller {
  static get _REST() {
    return true;
  }
  constructor(ctx) {
    super(ctx);
    this.resource = this.getResource();
    this.id = this.getId();
  }
  __before() {

  }
  getResource() {
    return this.ctx.controller.split('/').pop();
  }
  getId() {
    const id = this.get('id');
    if (id && (think.isString(id) || think.isNumber(id))) {
      return id;
    }
    const last = this.ctx.path.split('/').slice(-1)[0];
    if (last !== this.resource) {
      return last;
    }
    return '';
  }
};