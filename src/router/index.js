import { createRouter, createWebHistory} from "vue-router";

// 路由信息
const routes = [
    { path: '/home', redirect: '/' },
    {
        path: "/",
        name: "Home",
        meta: { title: '首页' },
        component:  () => import('../views/Home.vue'),
    },
    {
        path: "/about",
        name: "About",
        meta: { title: '关于' },
        component:  () => import('../views/About.vue'),
    },
    {
        path: "/threejs",
        name: "ThreeJs",
        meta: { title: 'ThreeJs' },
        component:  () => import('../views/ThreeJs.vue'),
    },
];

// 导出路由
const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from) => {
  // ...
  document.title=to.meta.title || '学忘食';
  // 返回 false 以取消导航
})

export default router;

