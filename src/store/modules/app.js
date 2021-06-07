import { otherRouter } from '@/router/router';
import { router } from '@/router/index';
import Util from '@/libs/util';
import Vue from 'vue';

const app = {
    state: {
        loading: false, // 全局加载动画
        added: false, // 加载路由标志
        navList: [], // 顶部菜单
        currNav: "", // 当前顶部菜单name
        currNavTitle: "", // 当前顶部菜单标题
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [
            // {
            //     title: '首页',
            //     path: '',
            //     name: 'home_index'
            // }
        ],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ], 
        // 面包屑数组
        menuList: [
            // {
            //     hidden: false,
            //     title: "系统管理",
            //     path: "/sys",
            //     children: [
            //         {
            //             path: "menu-manage",
            //             title: "菜单管理"
            //         },
            //         {
            //             path: "user-manage",
            //             title: "员工管理"
            //         },
            //         {
            //             path: "department-manage",
            //             title: "组织管理"
            //         },
            //         {
            //             path: "role-manage",
            //             title: "岗位管理"
            //         },
            //         {
            //             path: "dictMain",
            //             title: "值集管理"
            //         },
            //         {
            //             path: "auth-group-manage",
            //             title: "权限组管理"
            //         },
            //         {
            //             path: "business-role-manage",
            //             title: "业务角色管理"
            //         }
            //     ]
            // },
            // {
            //     hidden: false,
            //     title: "商品管理",
            //     path: "/commodity",
            //     children: [
            //         {
            //             path: "material-list",
            //             title: "物料管理"
            //         },
            //         {
            //             path: "category-manage",
            //             title: "商品分类管理"
            //         },
            //         {
            //             path: "spu-list",
            //             title: "spu查询"
            //         }
            //     ]
            // }
        ],
        routers: [
            otherRouter
        ],
        tagsList: [...otherRouter.children],
        noClosableTagList: [],
        messageCount: 0,
        // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        dontCache: ['test', 'test'],
        listTableHeight: 536, //列表表格高度
        mercusData:'null'
    },
    getters: {
        noClosableTagList (state) {
            return state.noClosableTagList;
        }
    },
    mutations: {
        // 动态添加主界面路由，需要缓存
        updateAppRouter(state, routes) {
            // console.log(routes)
            state.routers.push(...routes);
            router.addRoutes(routes);
            
            let workbenchRouter = routes.find(item => item.title == '工作台');
            if (workbenchRouter && workbenchRouter.children && workbenchRouter.children.length) {
                state.noClosableTagList.push(workbenchRouter.children[0].name);
                
                if (state.pageOpenedList.find(item => item.name == 'home_index')) {
                    state.pageOpenedList.map((item, index) => {
                        if (item.name == 'home_index') {
                            state.pageOpenedList.splice(index, 1);
                        }
                    });
                    if (state.cachePage.indexOf('home_index')) {
                        state.cachePage.splice(state.cachePage.indexOf('home_index'), 1);
                        localStorage.cachePage = JSON.stringify(state.cachePage);
                    }
                }
                router.push({
                    path: workbenchRouter.children[0].path,
                });
            } else {
                state.noClosableTagList.push('home_index')
                router.push({
                    name: "home_index",
                });
            }
            
        },
        // 动态添加全局路由404、500等页面，不需要缓存
        updateDefaultRouter(state, routes) {
            router.addRoutes(routes);
        },
        setLoading(state, v) {
            state.loading = v;
        },
        mercusData(state, v) {
            state.mercusData = v;
        },
        setAdded(state, v) {
            state.added = v;
        },
        setNavList(state, list) {
            state.navList = list;
        },
        setCurrNav(state, v) {
            state.currNav = v;
        },
        setCurrNavTitle(state, v) {
            state.currNavTitle = v;
        },
        setTagsList(state, list) {
            state.tagsList.push(...list);
        },
        updateMenulist(state, routes) {
            state.menuList = routes;
        },
        addOpenSubmenu(state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length == 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage(state, name) {
            state.cachePage.forEach((item, index) => {
                if (item == name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage(state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag(state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name == name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
            if (state.cachePage.indexOf(name)) {
                state.cachePage.splice(state.cachePage.indexOf(name), 1);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
        },
        pageOpenedList(state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags(state) {
            let pageOpenedList = [];
            state.pageOpenedList.forEach(page => {
                if (state.noClosableTagList.find(item => item == page.name)) {
                    pageOpenedList.push(page)
                }
            })
            state.pageOpenedList = pageOpenedList;
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags(state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name == currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex == 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item == currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList(state) {
            state.pageOpenedList = localStorage.pageOpenedList ? Util.getStore('pageOpenedList') : []
        },
        setCurrentPath(state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName(state, name) {
            state.currentPageName = name;
        },
        setAvatarPath(state, path) {
            localStorage.avatarImgPath = path;
        },
        switchLang(state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu(state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount(state, count) {
            state.messageCount = count;
        },
        increateTag(state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    }
};

export default app;
