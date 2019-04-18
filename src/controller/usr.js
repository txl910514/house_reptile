const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {
    async loginAction () {
        var ctx = this.ctx;
        if (ctx.method === 'POST') {

        } else if (ctx.method === 'GET'){
        }
    }
};
