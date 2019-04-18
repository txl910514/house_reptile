const ApiBase = require('./apiBase.js');

module.exports = class extends ApiBase {
    async indexAction() {
        var ctx = this.ctx;
        switch (ctx.method) {
            case 'GET':
                await this.priceReptileAction();
                break;
            case 'POST':
                // console.log(this.ctx.service);
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
    async priceReptileAction() {
        let reptileService = think.service('reptileService');
        let markedContent = await reptileService.render();
        console.log(markedContent);
        if (markedContent) {
            this.success(markedContent);
        } else {
            this.fail('页面打开失败');
        }
    }
};