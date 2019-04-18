const Base = require('./base.js');
module.exports = class extends Base {
    __before() {}
    __call() {}
    getAction () {
        this.success({
            method: this.ctx.method
        })
    }
    postAction () {
        this.success({
            method: this.ctx.method
        }) 
    }
    putAction () {
        this.success({
            method: this.ctx.method
        }) 
    }
    deleteAction () {
        this.success({
            method: this.ctx.method
        }) 
    }
}