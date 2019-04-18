module.exports = class extends think.Mongo  {
    async getList() {
        return await this.field('name').select();
      }
};
