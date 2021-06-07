import { api } from '@/api/index';
import axios from 'axios'
import vm from '@/main.js';
import lazyLoading from './lazyLoading.js';
import { getStore, setStore } from './storage';
// import { Message } from 'view-design'
import cacheRouteList from '@/config/cache-route.config'
import store from '@/store/index'
import router from '@/router/index'

let util = {
  getStore: getStore,
  setStore: setStore,
};
util.spin = function (flag) {
  if (flag) vm.openSpin();
  else vm.closeSpin();
};
//将时间戳转换为日期格式 yyyy-MM
util.formatMonth = function (timeStamp) {
  if (timeStamp == null || timeStamp === '') {
    return '';
  }
  let date = new Date(timeStamp);
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  return date.getFullYear() + '-' + month;
};
//将时间戳转换为日期格式 yyyyMM
util.formatMonthT = function (timeStamp) {
  if (timeStamp == null || timeStamp === '') {
    return '';
  }
  let date = new Date(timeStamp);
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  return date.getFullYear() + '' + month;
};
//将时间戳转换为日期格式 yyyyMM
util.formatMonthReport = function () {
  let date = new Date();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  return date.getFullYear() + month;
};
//将时间戳转换为日期格式 yyyy-MM-dd
util.formatDate = function (timeStamp) {
  if (timeStamp == null || timeStamp == '') {
    return '';
  }
  let date = new Date(timeStamp);
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
};
//将时间戳转换为日期格式 yyyy-MM-dd hh:mm:ss
util.formatDateTime = function (timeStamp) {
  //shijianchuo是整数，否则要parseInt转换
  function add0 (m) {
    return m < 10 ? '0' + m : m;
  }

  var time = new Date(timeStamp);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    '-' +
    add0(m) +
    '-' +
    add0(d) +
    ' ' +
    add0(h) +
    ':' +
    add0(mm) +
    ':' +
    add0(s)
  );
};

util.formatDuring = function (timeStamp) {
  var hours = parseInt(timeStamp / (1000 * 60 * 60));
  var minutes = parseInt((timeStamp % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = parseInt((timeStamp % (1000 * 60)) / 1000);
  var str = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  return str;

  function pad (s) {
    return s < 10 ? '0' + s : s;
  }
};
util.getThreeMonths = function (dtstr) {
  var s = dtstr.split('-');
  var yy = parseInt(s[0]);
  var mm = parseInt(s[1]);
  var dd = parseInt(s[2]);
  var dt = new Date(yy, mm - 4, dd);
  return dt.valueOf();
};
util.getThreeMonthsAfter = function (dtstr) {
  var s = dtstr.split('-');
  var yy = parseInt(s[0]);
  var mm = parseInt(s[1]);
  var dd = parseInt(s[2]);
  var dt = new Date(yy, mm + 2, dd);
  return dt.valueOf();
};
util.title = function (title) {
  title = title || '';
  window.document.title = title;
};

util.inOf = function (arr, targetArr) {
  let res = true;
  arr.forEach((item) => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

/**
 * @description  获取token
 *
 * @returns  token
 */
util.getToken = function () {
  return getStore('userAppInfo').token;
};

/**
 * @description  获取用户信息
 *
 * @returns  用户信息
 */
util.getuserAppInfo = function () {
  return getStore('userAppInfo');
};
/**
 * 获取在页面上暂存的信息
 */
util.getPageStorge = function (vm, currentPath) {
  let storgeList = vm.$store.state.storgeList;
  storgeList.forEach(item => {
    if (item.path == currentPath) {
      return item
    } else {
      return false
    }
  })
}

/**
 * @description  设置用户信息
 *
 * @param {*} userInfo  用户信息
 */
util.setuserAppInfo = function (userInfo) {
  setStore('userAppInfo', userInfo);
};

util.oneOf = function (ele, targetArr) {
  return targetArr.indexOf(ele) >= 0;
};

util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  let routerObj = null;
  for (let item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = util.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

util.handleTitle = function (vm, item) {
  if (typeof item.title == 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.setCurrentPath = function (vm, name) {
  let title = '';
  let isOtherRouter = false;
  let a = { b: [] };
  vm.$store.state.app.routers.forEach(function (item) {
    let childrenKey = 'children';
    if (this.getRealType(item[childrenKey]) === 'Array') {
      item[childrenKey].forEach((child) => {
        if (child.name === name) {
          title = this.handleTitle(vm, child);
          if (item.name === 'otherRouter') {
            isOtherRouter = true;
          }
        }
      }, this);
    }
  }, this);
  let currentPathArr = [];
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
        ),
        path: '',
        name: 'home_index',
      },
    ];
  } else if (
    (name.indexOf('_index') >= 0 || isOtherRouter) &&
    name !== 'home_index'
  ) {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
        ),
        path: '/home',
        name: 'home_index',
      },
      {
        title: title,
        path: '',
        name: name,
      },
    ];
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter((item) => {
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      } else {
        let i = 0;
        let childArr = item.children;
        let len = childArr.length;
        while (i < len) {
          if (childArr[i].name === name) {
            return true;
          }
          i++;
        }
        return false;
      }
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index',
        },
      ];
    } else if (
      currentPathObj.children.length <= 1 &&
      currentPathObj.name !== 'home'
    ) {
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index',
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name,
        },
      ];
    } else {
      let childObj = currentPathObj.children.filter((child) => {
        return child.name === name;
      })[0];
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index',
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name,
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name,
        },
      ];
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr);

  return currentPathArr;
};

util.openNewPage = function (vm, to, argu, query) {
  let name = to.name;
  if (!vm.$store) {
    return;
  }
  setStore('currentOnlcikMenuNo', to.path);
  let pageOpenedList = vm.$store.state.app.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) {
      // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query,
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children && item.children[0]) {
        return name === item.children[0].name;
      } else {
        if (name === item.name) {
        }
        return name === item.name;
      }
    });
    tag = tag[0];
    if (tag) {
      tag = tag.children && tag.children[0] ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit('increateTag', tag);
    }
  }
  vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
  // let len = routers.length;
  // let i = 0;
  let notHandle = true;
  // while (i < len) {
  //   if (
  //     routers[i].name === name &&
  //     routers[i].children &&
  //     routers[i].redirect === undefined
  //   ) {
  //     route.replace({
  //       name: routers[i].children[0].name,
  //     });
  //     notHandle = false;
  //     next();
  //     break;
  //   }
  //   i++;
  // }
  if (notHandle) {
    next();
  }
};

util.fullscreenEvent = function (vm) {
  vm.$store.commit('initCachepage');
};

util.initRouter = function (vm) {
  const constRoutes = [];
  const otherRoutes = [];

  // 404路由需要和动态路由一起加载
  const otherRouter = [
    {
      path: '/*',
      name: 'error-404',
      meta: {
        title: '404-页面不存在',
      },
      component: '/error-page/404',
    },
  ];
  // 判断用户是否登录
  let userInfo = getStore('userAppInfo');
  if (!userInfo) {
    // 未登录
    return;
  }
  let getNewMenuDataflag =
    window.localStorage.getItem('menuData') == null ||
    vm.getStore('refreshLeftMenuFlag');
  // if (!vm.$store.state.app.added) {
  if (getNewMenuDataflag) {
    if (vm.getStore('refreshLeftMenuFlag')) {
      vm.setStore('refreshLeftMenuFlag', false);
    }
    // 加载菜单
    let currentCompany = vm.getStore('currentCompany') || {};
    let userAppInfo = vm.getStore('userAppInfo') || {};
    let empId = userAppInfo.empId;
    api
      .getMenuList({
        sysType: '01',
        sysCode: '02',
        empId,
        companyId: currentCompany.orgId
      })
      .then((res) => {
        res = res.data;
        if (res.success) {
          let menuData = res.data.menuButtonTreeDTOS;
          menuData.forEach((el) => {
            el.title = el.elementName;
            el.component = el.elementUrl;
            el.name = el.elementNo;
            el.path = el.elementNo;
            el.hidden = el.visibleFlag == '1' ? false : true;
            el.children = el.menuButtonTreeDTOS || [];
            el.children.length && handle(el);
          });

          function handle (data) {
            if (util.getRealType(data.children) == 'Array')
              data.children.map((el) => {
                el.title = el.elementName;
                el.component = el.elementUrl;
                el.name = el.elementNo;
                el.path = el.elementNo;
                el.hidden = el.visibleFlag == '1' ? false : true;
              });
          }

          let buttonList = menuData.reduce((prev, curr) => {
            var btnArr = curr.menuButtonTreeDTOS.reduce((prev, curr) => {
              var btnList = curr.menuButtonTreeDTOS ? curr.menuButtonTreeDTOS.filter(item => item.elementType == 'button') : [];
              return [...prev, ...btnList]
            }, [])
            return [...prev, ...btnArr]
          }, [])
          setStore('btnList', buttonList);
          menuData = [
            {
              type: -1,
              children: menuData,
            },
          ];
          if (menuData) {
            util.initAllMenuData(constRoutes, menuData);
            util.initRouterNode(otherRoutes, otherRouter);
            //添加所有主界面路由
            vm.$store.commit(
              'updateAppRouter',
              constRoutes.filter((item) => {
                if (util.getRealType(item.children) == 'Array') {
                  return item.children.length > 0;
                }
              })
            );
            //添加全局路由
            vm.$store.commit('updateDefaultRouter', otherRoutes);
            //添加菜单路由
            util.initMenuData(vm, menuData);
            //缓存数据 修改加载标识
            setStore('menuData', JSON.stringify(menuData));
          }
          vm.$store.commit('setAdded', true);
        } else {
          util.initRouterNode(otherRoutes, otherRouter);
          //添加所有主界面路由
          vm.$store.commit('updateAppRouter', '[]');
          //添加全局路由
          vm.$store.commit('updateDefaultRouter', otherRoutes);
          setStore('menuData', '[]');
          vm.$store.commit('setAdded', true);
        }
      });
  } else {
    // 读取缓存数据
    let data = window.localStorage.getItem('menuData');
    if (!data) {
      vm.$store.commit('setAdded', false);
      return;
    } else {
      let menuData = JSON.parse(data);
      util.initAllMenuData(constRoutes, menuData);
      util.initRouterNode(otherRoutes, otherRouter);
      //添加所有主界面路由
      vm.$store.commit(
        'updateAppRouter',
        constRoutes.filter((item) => {
          if (util.getRealType(item.children) == 'Array') {
            return item.children.length > 0;
          }
        })
      );
      //添加全局路由
      vm.$store.commit('updateDefaultRouter', otherRoutes);
      //添加菜单路由
      util.initMenuData(vm, menuData);
      //缓存数据 修改加载标识
      setStore('menuData', JSON.stringify(menuData));
    }
  }
};

// 添加所有顶部导航栏下的菜单路由
util.initAllMenuData = function (constRoutes, data) {
  let allMenuData = [];
  data.forEach((e) => {
    if (e.type === -1) {
      e.children.forEach((item) => {
        allMenuData.push(item);
      });
    }
  });
  util.initRouterNode(constRoutes, allMenuData);
};

// 生成菜单格式数据
util.initMenuData = function (vm, data) {
  let item;
  const menuRoutes = [];
  let menuData = data;
  // 顶部菜单
  let navList = [];
  menuData.forEach((e) => {
    let nav = {
      name: e.name,
      title: e.title,
      icon: e.icon,
    };
    navList.push(nav);
  });
  if (navList.length < 1) {
    return;
  }
  // 存入vuex
  vm.$store.commit('setNavList', navList);
  let currNav = window.localStorage.getItem('currNav');
  if (currNav) {
    // 读取缓存title
    for (item of navList) {
      if (item.name === currNav) {
        vm.$store.commit('setCurrNavTitle', item.title);
        break;
      }
    }
  } else {
    // 默认第一个
    currNav = navList[0].name;
    vm.$store.commit('setCurrNavTitle', navList[0].title);
  }
  vm.$store.commit('setCurrNav', currNav);
  for (item of menuData) {
    if (item.name === currNav) {
      // 过滤
      menuData = item.children;
      break;
    }
  }
  util.initRouterNode(menuRoutes, menuData);
  // 刷新界面菜单
  vm.$store.commit(
    'updateMenulist',
    menuRoutes.filter((item) => {
      if (util.getRealType(item.children) == 'Array') {
        return item.children.length > 0;
      }
    })
  );

  let tagsList = [];
  if (this.getRealType(vm.$store.state.app.routers) === 'Array')
    vm.$store.state.app.routers.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
  vm.$store.commit('setTagsList', tagsList);
};

// 生成路由节点
util.initRouterNode = function (routers, data) {
  for (const item of data) {
    let menu = Object.assign({}, item);
    // menu.component = import(`@/views/${menu.component}.vue`);
    // console.log(menu.name,menu.path)
    menu.component = lazyLoading(menu.component);
    if (item.children && item.children.length > 0) {
      menu.children = [];
      util.initRouterNode(menu.children, item.children);
    }

    let meta = {};

    let buttonPerms = [];
    if (menu.buttons) {
      menu.buttons.forEach((e) => {
        buttonPerms.push(e.name);
      });
    }
    // 给页面添加权限、标题、第三方网页链接
    meta.permTypes = buttonPerms ? buttonPerms : null;
    meta.title = menu.title ? menu.title + '' : null;
    meta.url = menu.url ? menu.url : null;
    meta.keepAlive = cacheRouteList.find(route => route == item.name) ? true : false;
    menu.meta = meta;
    routers.push(menu);
  }
};
// 日期组件 获取/重置日期
util.changeDatePicker = function (fromData, name) {
  fromData[`${name}Start`] = fromData[name][0];
  fromData[`${name}End`] = fromData[name][1];
};
// 节流函数
util.throttle = function (fn, wait) {
  var prev = 0;
  return function () {
    var now = Date.now();
    var context = this;
    var argus = arguments;
    if (now - prev >= wait) {
      fn.apply(context, argus);
      prev = Date.now();
    }
  };
};

// 防抖函数
util.debounce = function (func, wait) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

/**
 * 数据深拷贝
 * @param {Object} obj
 * @param {Fn} hash
 * @returns {Object}
 */
function deepClone (obj, hash = new WeakMap()) {
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj === null || typeof obj !== 'object') {
    //如果不是复杂数据类型，直接返回
    return obj;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  /**
   * 如果obj是数组， 那么 obj.constructor 是 [Function: Array]
   * 如果obj是对象， 那么 obj.constructor 是 [Function: Object]
   */

  let t = new obj.constructor();
  hash.set(obj, t);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      t[key] = deepClone(obj[key], hash);
    }
  }
  return t;
}

util.deepClone = deepClone;

util.numNull = function (num) {
  if (!num || num == null || num == undefined) {
    return 0;
  }
  return num * 1;
};

util.isNum = function (value) {
  console.log(value);
  if (value === undefined || value === null || value === '') {
    return false;
  }

  if (typeof value === 'string') {
    //正整数
    var reNumber = /^\d+$/;
    //负整数
    var reNeNumber = /^-\d+$/;
    //正实数
    var reRealNumber1 = /^[1-9]\d*[.]\d+$/; //非零开头
    var reRealNumber2 = /^0[.]\d+$/; //零开头
    //负实数
    var reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/; //非零开头
    var reNeRealNumber2 = /^-0[.]\d+$/; //零开头

    if (
      reNumber.test(value) ||
      reNeNumber.test(value) ||
      reRealNumber1.test(value) ||
      reRealNumber2.test(value) ||
      reNeRealNumber1.test(value) ||
      reNeRealNumber2.test(value)
    ) {
      return true;
    } else {
      return false;
    }
  } else if (typeof value === 'number') {
    return true;
  } else {
    return false;
  }
};
/**
 * 正实数验证
 * @param rule 验证规则（正实数）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
util.positiveRealNumber = (rule, value, callback) => {
  const reg = /^[1-9][0-9]+.?[0-9]+$/;
  if (!reg.test(value)) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
util.getLocalInfo = function (val, val2) {
  return JSON.parse(localStorage.getItem(val))[val2];
};
// 正数验证
util.positiveNumberValidate = (rule, value, callback) => {
  if (value === '' && rule.required) {
    callback(new Error(rule.keyName + '不能为空'));
  } else if (value === 0 || (value && value <= 0)) {
    callback(new Error(rule.keyName + '必须大于0'));
  } else {
    callback();
  }
};
// 非负数验证
util.positiveNonnegativeNumberValidate = (rule, value, callback) => {
  if (value === '' && rule.required) {
    callback(new Error(rule.keyName + '不能为空'));
  } else if (value === 0 || (value && value < 0)) {
    callback(new Error(rule.keyName + '必须大于等于0'));
  } else {
    callback();
  }
};

util.positiveNumberValidateCanBeNull = (rule, value, callback) => {
  if (value === '' && rule.required) {
    return callback();
  } else if (value === 0 || (value && value <= 0)) {
    callback(new Error(rule.keyName + '必须大于0'));
  } else {
    callback();
  }
};

// 正整数验证
util.positiveIntegerValidate = (rule, value, callback) => {
  let reg = /^[1-9]\d*$/;
  if (value === '' && rule.required) {
    callback(new Error(rule.keyName + '不能为空'));
  } else if (value == 0 || (value && !reg.test(value))) {
    callback(new Error(rule.keyName + '必须为正整数'));
  } else {
    callback();
  }
};

// 正整数验证
util.positiveIntegerValidateCanBeNull = (rule, value, callback) => {
  let reg = /^[1-9]\d*$/;
  if (value === '' && rule.required) {
    return callback();
  } else if (value == 0 || (value && !reg.test(value))) {
    callback(new Error(rule.keyName + '必须为正整数'));
  } else {
    callback();
  }
};
util.getRealType = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

//金额格式化
util.amount = function (strData, n) {
  var minusNum = false; //负数标识
  if (strData && String(strData).indexOf('-') === -0) {
    strData = String(strData).substr(1);
    minusNum = true;
  }
  var CurrencyAndAmountRegExp = /^(\d{1,18})|(\d{1,18}\.)|(\d{1,17}\.\d{0,1})|(\d{1,16}\.\d{0,2})|(\.\d{1,2})$/;
  var _result = CurrencyAndAmountRegExp.test(strData);
  if (_result == false) {
    return 0;
  }
  // 一般来说最多就6位吧，当然如果有特殊需求可自行更改(｀・∀・´)
  n = n > 0 && n <= 8 ? n : 2;
  var formatData =
    util.toFixed(parseFloat((strData + '').replace(/[^\d\.-]/g, '')), n) + '';
  var l = formatData.split('.')[0].split('').reverse();
  var r = formatData.split('.')[1];
  var t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  if (minusNum) {
    return '-' + t.split('').reverse().join('') + '.' + r;
  }
  return t.split('').reverse().join('') + '.' + r + '';
};

// toFixed兼容方法
util.toFixed = function (strData, n) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  const number = strData;
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof n == 'undefined' || n == 0) {
    return Math.round(number).toString();
  }

  let result = number.toString();
  const arr = result.split('.');

  // 整数的情况
  if (arr.length < 2) {
    result += '.';
    for (let i = 0; i < n; i += 1) {
      result += '0';
    }
    return result;
  }

  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += '0';
    }
    return result;
  }
  result = integer + '.' + decimal.substr(0, n);
  const last = decimal.substr(n, 1);

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n);
    result = (Math.round(parseFloat(result) * x) + 1) / x;
    result = result.toFixed(n);
  }

  return result;
};

util.amountNum = function (strData, n) {
  var num = util.amount(strData, n);
  return num.replace(/,/g, '');
};

//数字精度 默认大于0
util.strip = function (num, precision = 9) {
  num = +Number.parseFloat(num);
  if (num.toString() === 'NaN') {
    num = 0;
  }
  if (num < 0) {
    return -util.strip(Math.abs(num), precision);
  }
  if (num >= 1) {
    const temp = (num + '').split('.');
    return parseFloat(num.toPrecision(precision + temp[0].length));
  } else {
    num += 1;
    const temp = (num + '').split('.');
    const string = num.toPrecision(precision + temp[0].length);
    const res = parseFloat(string.replace('1.', '0.'));
    if (res === 2) {
      return '1';
    } else {
      return parseFloat(string.replace('1.', '0.'));
    }
  }
};

util.downLoadPDF = function (name, url) {

  axios({
    method: "get",
    url: url,
    responseType: "blob",
  }).then((res) => {
    var blob = new Blob([res.data], {
      type:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
    });
    var contentDisposition = res.headers["content-disposition"];
    var filename = name
    var downloadElement = document.createElement("a");
    var href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.style.display = "none";
    downloadElement.href = href;
    downloadElement.download = filename; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
  });
};
//保留小数位
util.tofix = function (num, s) {
  var times = Math.pow(10, s);
  var des = parseInt(num * times + 0.5, 10) / times;
  return des;
};
/**
 * @description 获取值集对应的name
 * @param codeSet 值集Json
 * @param key   要转换的KEY
 * @param code    编码
 * @returns 转译后的名称（没有转译成功，返回编码）
 */
util.getCodeSetName = function (codeSet, key, code) {
  var name = code;
  if (codeSet != null && codeSet != '') {
    codeSet[key] &&
      codeSet[key].forEach((item) => {
        if (item.itemCode == code) {
          name = item.itemName;
        }
      });
  }
  return name;
};

/**
 * @description 获取单个值集对应的name
 * @param codeArr 单个值集array
 * @param code    编码
 * @returns 转译后的名称（没有转译成功，返回编码）
 */
util.getCodeNameByCode = function (codeArr, code) {
  if (!code) return '';
  var val = code;
  // console.log(codeArr,code,"1111111")
  if (codeArr && codeArr.length) {
    for (var i = 0; i < codeArr.length; i++) {
      var item = codeArr[i];
      if (item.itemCode == code) {
        val = item.itemName;
        break;
      }
    }
  }
  return val;
};

util.getStatusNameByCode = function (arr, code) {
  var val = code;
  arr &&
    arr.forEach((item) => {
      if (item.value == code) {
        val = item.label;
      }
    });
  return val;
};

/**
 * @解析请求响应     判断token是否过期
 * @param res      响应参数
 */
util.parseReponse = function (res) {
  // if (!res.success && res.code != null && res.code.indexOf('TK') != -1) {
  //   window.location.href = '/login';
  //   return false;
  // }
  // return true;
};

/**
 * @description     文件下载
 * @param url       地址
 * @param method    'GET', 'POST'
 * @param filename  文件名
 * @param params  参数对象
 */
util.downloadFile = function (url, method, params) {
  let Authorization = localStorage.getItem('token')
  var oReq = new XMLHttpRequest();
  //判断请求方式

  if (method.toLowerCase() === "get") {
    params = paramsData(params);
    //如果是get请求则将url加在后面，并且需要根据是否存在问好和&来处理
    url += url.indexOf("?") == -1 ? "?" + params : "&" + params;
  }
  oReq.open(method, url, true);

  oReq.setRequestHeader('Authorization', Authorization);
  oReq.responseType = "blob";

  oReq.onload = function (oEvent) {
    var content = oReq.response;
    var reader = new FileReader();
    reader.readAsText(content);
    reader.onload = function (event) {
      let res = this.result;//内容就在这里
      if (res && res.indexOf('success') !== -1 && JSON.parse(res).success == false) {
        // return Message.error(JSON.parse(res).message);
      } else {
        let headerfileName = oReq.getResponseHeader("Content-Disposition");
        if (headerfileName) {
          if (decodeURI(headerfileName).search('attachment;filename=') != -1) {
            headerfileName = decodeURI(headerfileName.replace('attachment;filename=', ''));
          } else {
            headerfileName = decodeURI(headerfileName.replace('attachment; filename=', ''));
          }
        }
        let type = oReq.getResponseHeader("Content-Type");
        let blob = new Blob([content], { type: type });
        if (window.navigator.msSaveBlob) {
          // deal with IE 11, data是第一步toBlob的结果值
          window.navigator.msSaveOrOpenBlob(blob, headerfileName);
        }
        else {
          var elink = document.createElement('a');
          elink.download = headerfileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        }
      }
    };

  };
  if (method.toLowerCase() === "post") {
    params = JSON.stringify(params)
    // oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    oReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    oReq.send(params);
  } else {
    oReq.send(null);
  }

  //键值对转换字符串
  function paramsData (data) {
    var arr = [];
    for (var i in data) {
      arr.push(i + "=" + data[i]);
    }
    return arr.join("&");
  }
};

util.hasBtnPermisson = function (key) {
  let btnList = window.localStorage.getItem('btnList')
  if (!btnList) {
    return false;
  }
  btnList = JSON.parse(btnList)
  if (btnList.find(btn => btn.elementNo == key)) {
    return true;
  } else {
    return false;
  }
};

util.closeCurrentPage = function (routeName) {
  store.commit('removeTag', routeName);
  router.back();
};


/**zip img xlsx下载
 * @description     文件下载
 * @param imgUrl       地址
 */
(util.toBae64DownImg = function (imgUrl) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', imgUrl, true);
  xhr.setRequestHeader(
    'Authorization',
    JSON.parse(window.localStorage.getItem('userAppInfo')).token
  );
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (this.status == 200) {
      var blob = this.response;
      let oFileReader = new FileReader();
      oFileReader.onloadend = function (e) {
        let base64 = e.target.result;
        imgUrl = imgUrl.split('?')[1];
        var index = imgUrl.lastIndexOf('.');
        var fileType = imgUrl.substr(index + 1);
        var fileName = imgUrl.split('-')[1].split('.')[0];
        if ('msSaveOrOpenBlob' in navigator) {
          window.navigator.msSaveOrOpenBlob(blob, `${fileName}.${fileType}`);
          return;
        }
        const a = document.createElement('a');
        a.setAttribute('download', `${fileName}.${fileType}`);
        a.setAttribute('href', base64);
        a.click();
      };
      oFileReader.readAsDataURL(blob);
    }
  };
  xhr.send();
}),
  /**zip img xlsx下载
   * @description     文件下载
   * @param imgUrl       地址
   */
  (util.toBae64DownImgOne = function (imgUrl, fileType, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', imgUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status == 200) {
        var blob = this.response;
        let oFileReader = new FileReader();
        oFileReader.onloadend = function (e) {
          let base64 = e.target.result;

          if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, `${fileName}.${fileType}`);
            return;
          }
          const a = document.createElement('a');
          a.setAttribute('download', `${fileName}.${fileType}`);
          a.setAttribute('href', base64);
          a.click();
        };
        oFileReader.readAsDataURL(blob);
      }
    };
    xhr.send();
  }),
  /**
   * @description  金额转换
   * @param n  小写金额
   */
  (util.smalltoBIG = function (n) {
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟'],
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (var i = 0; i < unit[0].length && n > 0; i++) {
      var p = '';
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
    );
  });
/**
 *@description  url转对象
 * @param url
 */
(util.parseQueryString = function (url) {
  var reg_url = /^[^\?]+\?([\w\W]+)$/,
    reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g,
    arr_url = reg_url.exec(url),
    ret = {};
  if (arr_url && arr_url[1]) {
    var str_para = arr_url[1],
      result;
    while ((result = reg_para.exec(str_para)) != null) {
      ret[result[1]] = result[2];
    }
  }
  return ret;
}),
  (util.toNonExponential = function (num) {
    var m = Number(num)
      .toExponential()
      .match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return Number(num).toFixed(Math.max(0, (m[1] || '').length - m[2]));
  }),
  //金额格式化
  (util.amount_ = function (strData, n) {
    strData = strData + '';
    var minusNum = false; //负数标识
    if (strData && String(strData).indexOf('-') === -0) {
      strData = String(strData).substr(1);
      minusNum = true;
    }
    var CurrencyAndAmountRegExp = /^(\d{1,18})|(\d{1,18}\.)|(\d{1,17}\.\d{0,1})|(\d{1,16}\.\d{0,2})|(\.\d{1,2})$/;
    var _result = CurrencyAndAmountRegExp.test(strData);

    if (_result == false) {
      return '-';
    }
    // 一般来说最多就6位吧，当然如果有特殊需求可自行更改(｀・∀・´)
    // n不存在则全部保留，存在则按存在多少位进行保留
    if (strData.includes('.') && !n) {
      n = strData.split('.')[1].length;
    }
    var formatData = util.toFixed(strData.replace(/[^\d\.-]/g, ''), n) + '';
    var l = formatData.split('.')[0].split('').reverse();
    var r = formatData.split('.')[1];
    var t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
    }
    if (minusNum) {
      return '-' + t.split('').reverse().join('') + '.' + r;
    }

    return t.split('').reverse().join('') + '.' + r;
  });

export default util;
