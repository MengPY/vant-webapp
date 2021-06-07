import Vue from 'vue';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import { routers, otherRouter } from './router';
import { getStore, setStore } from '../libs/storage';
import getValueSetCode from "@/api/value-set"

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'hash',
    routes: routers
};

/**
 * @description 路由来源历史记录追踪
 * @explain 在历史记录中没有该路由的情况下直接push, 有则更新位置。
 * @explain 限制历史数据最多记录10条。
 * @author lucien GY.Tang
 * @time 2020/02/25
 */
var routerTrack = function (from) {
    let routerHistory = getStore("routerHistory") || [];
    let pathIndex = routerHistory.indexOf(from.path);
    if (pathIndex == -1) {
        routerHistory.push(from.path)
    } else if (pathIndex != -1) {
        routerHistory.splice(pathIndex, 1);
        routerHistory.push(from.path);
    }
    if (routerHistory.length > 10) {
        routerHistory.splice(0, 1)
    }
    setStore("routerHistory", routerHistory);
}


export const router = new VueRouter(RouterConfig);
export default router;

router.beforeEach((to, from, next) => {
    getValueSetCode(to.name, router) //值集
    Util.title(to.meta.title);
    if (to.name == 'loginTransfer') {
        next()
    } else if (!getStore('token') && to.name !== 'login') {
        next({
            name: 'login'
        });
    } else {
        if (to.matched.length === 0 && to.fullPath !== '/' && from.fullPath !== '/') {  //如果未匹配到路由
            next({ name: 'error-404' });
        } else {
            Util.toDefaultPage([...routers], to.name, router, next);
        }
    }
    // 路由来源历史记录追踪
    routerTrack(from)
});

router.afterEach((to) => {
    // console.log(to)
    Util.openNewPage(router.app, to, to.params, to.query);
    window.scrollTo(0, 0);
});
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}
