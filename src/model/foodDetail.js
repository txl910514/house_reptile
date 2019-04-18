module.exports = class extends think.Mongo {
    async addData(data) {
        let model = this.mongo('foodDetail');
        return await model.add(data);
    }
    async findDetail(data) {
        let model = this.mongo('foodDetail');
        return await model.where(data).find();
    }
    async updateData(whereData, update_data) {
        let model = this.mongo('foodDetail');
        return await model.where(whereData).update(update_data);
    }
};