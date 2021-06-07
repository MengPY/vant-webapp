import Main from '@/views/Main.vue';
import otherAppRouter from './modules/other-router'
import orderRouter from './modules/orderRouter'
import customerRouter from './modules/customerRouter'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录 '
    },
    component: () => import('@/views/login.vue')
};

export const loginTransferRouter = {
    path: '/loginTransfer',
    name: 'loginTransfer',
    meta: {
        title: '登录中转'
    },
    component: () => import('@/views/loginTransfer.vue')
};

// export const registRouter = {
//     path: '/regist',
//     name: 'regist',
//     meta: {
//         title: '注册结果'
//     },
//     component: () => import('@/views/regist.vue')
// };

// export const registResult = {
//     path: '/regist-result',
//     name: 'regist-result',
//     meta: {
//         title: '注册结果'
//     },
//     component: () => import('@/views/regist-result.vue')
// };

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home',
            meta: {
                title: '首页',
                needFooter: true,
                noHeader: true,
            },
            name: 'home_index', component: () => import('@/views/home/home.vue')
        },
        {
            path: 'order',
            meta: {
                title: '订单',
                needFooter: true,
                noHeader: true,
            },
            name: 'order', component: () => import('@/views/order/order.vue')
        },
        {
            path: 'stock',
            meta: {
                title: '库存',
                needFooter: true,
                noHeader: true,
                keepAlive: true
            },
            name: 'home_index', component: () => import('@/views/stock/stock.vue')
        },
        ...orderRouter,
        ...otherAppRouter,
        ...customerRouter
    ]
}
export const appRouter = [];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    loginTransferRouter,
    // registRouter,
    // registResult,
    otherRouter,
    ...appRouter,
    page500,
    page403,
];
