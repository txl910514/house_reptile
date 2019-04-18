const puppeteer = require('puppeteer');
module.exports = class extends think.Service {
    async render () {

        try {
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(600000);
            // await page.goto('https://chengdu.anjuke.com/', {
            //     waitUntil: 'networkidle0'
            // });
            await page.goto('https://cd.fang.anjuke.com/loupan/wenjiang/d4915_h2-3/', {
                waitUntil: 'networkidle0'
            });
            
            think.logger.info('打开页面');
            // await page.waitForSelector( '#glbNavigation > div > ul > li:nth-child(2) > a' );
            // await page.click('#glbNavigation > div > ul > li:nth-child(2) > a');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // });
            think.logger.info('点击跳转新房页面');
            // await page.waitForSelector( '#bubble_target > div.filter-item.filter-position > div > div.item-bd > div.item-list.area-bd > div.filter > a:nth-child(6)' );
            // await page.click('#bubble_target > div.filter-item.filter-position > div > div.item-bd > div.item-list.area-bd > div.filter > a:nth-child(6)');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // })
            think.logger.info('点击跳转温江区页面');
            // await page.click('#bubble_target > div:nth-child(2) > div > a:nth-child(2)');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // })
            // await page.waitForSelector( '#bubble_target > div:nth-child(2) > div > a:nth-child(3)' );
            // await page.click('#bubble_target > div:nth-child(2) > div > a:nth-child(3)');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // })
            think.logger.info('跳转');
            // // await page.waitForSelector( '#bubble_target > div:nth-child(3) > div > a:nth-child(3)' );
            // await page.click('#bubble_target > div:nth-child(3) > div > a:nth-child(3)');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // })
            // await page.waitForSelector( '#bubble_target > div:nth-child(3) > div > a:nth-child(4)' );
            // await page.click('#bubble_target > div:nth-child(3) > div > a:nth-child(4)');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // })
            think.logger.info('点击跳转户型页面');
            // await page.waitFor(1000);
            // await page.hover('#bubble_target > div.filter-item.more-status > div:nth-child(2)');
            // await page.waitFor(1000);
            // await page.waitForSelector( '#bubble_target > div.filter-item.more-status > div:nth-child(2) > div.more-status-content > a:nth-child(2)' );
            // await page.click('#bubble_target > div.filter-item.more-status > div:nth-child(2) > div.more-status-content > a:nth-child(2)');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // })
            // think.logger.info('点击跳转销售状态页面');
            // await page.waitForSelector( '.items-name' );
            // const pageList = await page.$$eval('.items-name', e=> {
            //     return e;
            // });
            // console.log(pageList);
            // console.log(pageList.length);
            const lists = await page.evaluate(() => {
                const list = [...document.querySelectorAll('.list-results > .key-list')];
                return list;
            })
            console.log(lists);
            return true;
        }
        catch (err) {
            think.logger.info(err.message);
            return false;
        }
    }
    m () {

    }
}