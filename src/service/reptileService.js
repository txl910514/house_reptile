const puppeteer = require('puppeteer');
module.exports = class extends think.Service {
    async render() {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.meishij.net/china-food/caixi/chuancai/', {
            timeout: 0 //防止加载超时
        });
        await page.waitFor(30 * 1000);
        const cuisineList = await page.$$eval('.listnav_dl_style1 dd', e => {
            var list = [];
            for (let i = 0; i < e.length; i++) {
                list[i] = {};
                list[i]['name'] = e[i].querySelector('a') ? e[i].querySelector('a').innerText : '';
                list[i]['href'] = e[i].querySelector('a') ? e[i].querySelector('a').href : '';
            }
            return list
        });
        for (let i = 0; i < cuisineList.length; i++) {
            let obj = {
                name: cuisineList[i].name
            }
            let name = await think.model('cuisine').findDetail(obj);
            var id;
            id = name._id;
            if (!Object.keys(name).length) {
                id = await think.model('cuisine').addData(obj);
            }
            if ((name.finish_page || 0 ) < (name.total_page || 10000 )) {
                await this.pageFood(browser, cuisineList[i].href, id, name.finish_page || 1);
            }         
        }
        await page.close();
        return cuisineList;
    }
    async pageFood(browser, url, cuisine_id, pageNum) {
        let page = await browser.newPage();
        let total_page = 1;
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url + '?&page=' + pageNum, {
            timeout: 0 //防止加载超时
        });
        await page.waitFor(30 * 1000);
        console.log('当前页', pageNum);
        const nextPage = await page.evaluate(() => {
            return document.querySelector('.next') ? document.querySelector('.next').innerText : ''
        });
        let pageList = await page.$$eval('.listtyle1_list .listtyle1', e => {
            var list = [];
            for (let i = 0; i < e.length; i++) {
                list[i] = {};
                list[i]['img'] = e[i].querySelector('.img') ? e[i].querySelector('.img').src : '';
                list[i]['name'] = e[i].querySelector('.img') ? e[i].querySelector('.img').alt : '';
                list[i]['time'] = e[i].querySelector('.li1') ? e[i].querySelector('.li1').innerText : '';
                list[i]['practice'] = e[i].querySelector('.li2') ? e[i].querySelector('.li2').innerText : '';
                list[i]['user_name'] = e[i].querySelector('.c1') ? (e[i].querySelector('.c1').querySelector('em') ? e[i].querySelector('.c1').querySelector('em').innerText : '') : '';
                list[i]['tag'] = e[i].querySelector('.gx') ? (e[i].querySelector('.gx').querySelector('span') ? e[i].querySelector('.gx').querySelector('span').innerText : '') : '';
                list[i]['href'] = e[i].querySelector('.big') ? e[i].querySelector('.big').href : '';
            }
            return list
        });
        for (let i = 0; i < pageList.length; i++) {
            let obj = {
                name: pageList[i].name,
                user_name: pageList[i].user_name
            }
            let name = await think.model('food').findDetail(obj);
            var id;
            if (!Object.keys(name).length) {
                let newObj = JSON.parse(JSON.stringify(pageList[i]));
                newObj.cuisine_id = cuisine_id;
                delete newObj.href;
                id = await think.model('food').addData(newObj);
            } else {
                if (!name.cuisine_id) {
                    await think.model('food').updateData({_id: name._id}, {cuisine_id: cuisine_id}); 
                }
            }
            id =  id ? id : name._id;
            await this.pageFoodDetail(browser, pageList[i].href, id, obj.name, obj.user_name);
        }
        try {
            total_page = await page.$eval('.gopage', e => {
                var numArr = e.innerText.match(/\d+/g)
                return parseInt(numArr[0])
            })
        } catch (e) {
            total_page = 1;
        }
        console.log('总页数', total_page);
        await think.model('cuisine').updateData({_id: cuisine_id}, {finish_page: pageNum, total_page: total_page});
        if (pageNum < total_page && nextPage) {
            pageNum += 1;
            await this.pageFood(browser, url, cuisine_id, pageNum++)
        } 
        await page.close();
    }
    async pageFoodDetail(browser, url, food_id, name, user_name) {
        let page = await browser.newPage();
        let foodDetail = await think.model('foodDetail').findDetail({name: name, user_name: user_name});
        if (!Object.keys(foodDetail).length) {
            await page.setDefaultNavigationTimeout(0);
            await page.goto(url, {
                timeout: 0 //防止加载超时
            });
            await page.waitFor(30 * 1000);
            let detailObj = {};
            // detailObj.name = await page.$eval('.cp_main_info_w .info1 .title a', e => {
            //     return e.innerText
            // })
            try {
                detailObj.technics = await page.$eval('#tongji_gy', e => {
                    return e.innerText
                })
            } catch (e) {
                detailObj.technics = '未知'
            }

            try {
                detailObj.difficulty = await page.$eval('#tongji_nd', e => {
                    return e.innerText
                })
            } catch (e) {
                detailObj.difficulty = '未知'
            }
            try {
                detailObj.number = await page.$eval('#tongji_rsh', e => {
                    return e.innerText
                })
            } catch (e) {
                detailObj.number = '未知'
            }
            try {
                detailObj.taste = await page.$eval('#tongji_kw', e => {
                    return e.innerText
                })
            } catch (e) {
                detailObj.taste = '未知'
            }
            try {
                detailObj.prepare_time = await page.$eval('#tongji_zbsj', e => {
                    return e.innerText
                })
            } catch (e) {
                detailObj.prepare_time = '未知'
            }
            try {
                detailObj.cuisine_time = await page.$eval('#tongji_prsj', e => {
                    return e.innerText
                })
            } catch (e) {
                detailObj.cuisine_time = '未知'
            }

            detailObj.tags = await page.$$eval('.yj_tags dt a', e => {
                let list = [];
                for (let i = 0; i < e.length; i++) {
                    list.push(e[i].innerText);
                }
                return list;
            });
            detailObj.main_ingredient = await page.$$eval('.materials_box .zl li', e => {
                let list = [];
                for (let i = 0; i < e.length; i++) {
                    list[i] = {};
                    list[i]['img'] = e[i].querySelector('img') ? e[i].querySelector('img').src : '';
                    list[i]['name'] = e[i].querySelector('h4') ? (e[i].querySelector('h4').querySelector('a') ? e[i].querySelector('h4').querySelector('a').innerText : '') : '';
                    list[i]['weight'] = e[i].querySelector('h4') ? (e[i].querySelector('h4').querySelector('a') ? e[i].querySelector('h4').querySelector('span').innerText : '') : '';
                }
                return list;
            });
            let material = await page.$$eval('.materials_box .fuliao', e => {
                let list = [];
                for (let j = 0; j < e.length; j++) {
                    list[j] = [];
                    for (let i = 0; i < e.length; i++) {
                        list[j][i] = {};
                        list[j][i]['name'] = e[i].querySelector('h4') ? (e[i].querySelector('h4').querySelector('a') ? e[i].querySelector('h4').querySelector('a').innerText : '') : '';
                        list[j][i]['weight'] = e[i].querySelector('span') ? e[i].querySelector('span').innerText : '';
                    }
                }
                return list;
            });
            detailObj.accessories = material[0] || []
            detailObj.seasoning =material[1] || []
            detailObj.seasoning =material[1] || []
            try {
                detailObj.describe = await page.$eval('.materials > p', e => {
                    return e.innerText
                })
            } catch (e) {
                detailObj.describe = ''
            }

            try {
                detailObj.practice = await page.$$eval('.editnew .content', e => {
                    let list = [];
                    for (let i = 0; i < e.length; i++) {
                        list[i] = {};
                        list[i]['img'] = e[i].querySelector('img') ? e[i].querySelector('img').src : '';
                        list[i]['text'] = e[i].querySelector('p') ? e[i].querySelector('p').innerText : '';
                    }
                    return list;
                })
            } catch (e) {
                detailObj.practice = []
            }
            if (!(detailObj.practice || []).length) {
                try {
                    detailObj.practice = await page.$$eval('.edit.edit_class_0 > p', e => {
                        let list = [];
                        let textIndex = 0;
                        for (let i = 0; i < e.length; i++) {
                            list[i] = {};
                            if (e[i].innerText) {
                                textIndex = i;
                                list[i]['text'] = e[i].innerText ? e[i].innerText : '';
                            }
                            if (e[i].querySelector('img') ? e[i].querySelector('img').src : '') {
                                if (!list[textIndex]['img']) {
                                    list[textIndex]['img'] = e[i].querySelector('img') ? e[i].querySelector('img').src : ''
                                } 
                            }
                        }
                        return list;
                    })
                } catch (e) {
                    detailObj.practice = []
                }
            }
            detailObj.finished_product = await page.$$eval('.swiper-container img', e => {
                let list = [];
                for (let i = 0; i < e.length; i++) {
                    list[i] = e[i].src || '';
                }
                return list;
            })
            try {
                detailObj.skill = await page.$$eval('.editnew > p', e => {
                    let list = [];
                    for (let i = 0; i < e.length; i++) {
                        list[i] = e[i].innerText || '';
                    }
                    return list;
                })
            } catch (e) {
                detailObj.skill = []
            }
            if (!(detailObj.skill || []).length) {
                try {
                    detailObj.skill = await page.$eval('.edit.edit_class_0', e => {
                        let list = [];
                        let index = 0;
                        let children = e.children || []
                        for (let i = 0; i < children.length; i++) {
                            if (i > 0 && children[i -1].innerText == '烹饪技巧') {
                                list[index] = children[i].innerText || '';
                                index ++;
                            }
                        }
                        return list;
                    })
                } catch (e) {
                    detailObj.skill = []
                }
            }
            detailObj.food_id = food_id;
            detailObj.user_name = user_name;
            detailObj.name = name;
            await think.model('foodDetail').addData(detailObj);
        } else {
            if (!foodDetail.food_id) {
                await think.model('foodDetail').updateData({_id: foodDetail._id}, {food_id: food_id});
            }
        }
        await page.close();
    }
}