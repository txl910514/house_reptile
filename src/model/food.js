module.exports = class extends think.Mongo {
    async addData(data) {
        let model = this.mongo('food');
        return await model.add(data);
    }
    async findDetail(data) {
        let model = this.mongo('food');
        return await model.where(data).find();
    }
};