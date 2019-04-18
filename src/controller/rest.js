const Base = require('./base.js');
module.exports = class extends Base {
  __before() {}
  /**
   * get resource
   * @return {String} [resource name]
   */
  async getAction() {
    let data = {};
    think.logger.info('1');
    // console.log(this.id);
    if (this.id) {
      const pk = this.modelInstance.pk;
      // console.log(pk);
      data = await this.modelInstance.where({ [pk]: this.id }).find();
      return this.success(data);
    }
    // data = await this.modelInstance.select();
    data = await this.modelInstance.getList();
    return this.success(data);
  }
  /**
   * put resource
   * @return {Promise} []
   */
  async postAction() {
    const pk = this.modelInstance.pk;
    const data = this.post();
    delete data[pk];
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    const insertId = await this.modelInstance.add(data);
    return this.success({ id: insertId });
  }
  /**
   * delete resource
   * @return {Promise} []
   */
  async deleteAction() {
    if (!this.id) {
      return this.fail('params error');
    }
    const pk = this.modelInstance.pk;
    const rows = await this.modelInstance.where({ [pk]: this.id }).delete();
    return this.success({ affectedRows: rows });
  }
  /**
   * update resource
   * @return {Promise} []
   */
  async putAction() {
    // console.log(this.post());
    if (!this.id) {
      return this.fail('params error');
    }
    const pk = this.modelInstance.pk;
    const data = this.post();
    data[pk] = this.id; // rewrite data[pk] forbidden data[pk] !== this.id
    if (think.isEmpty(data) && JSON.stringify(data || {} === '{}')) {
      return this.fail('data is empty');
    }
    const rows = await this.modelInstance.where({ [pk]: this.id }).update(data);
    return this.success({ affectedRows: rows });
  }
  __call() {}
};