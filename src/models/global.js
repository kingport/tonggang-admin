import { getUserInfo } from '@/services/login';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    driverPhone: null,
    searchValue: {},
    orderSearchValue: {},
    searchIntendedValue: {},
    searchAdvancepayValue: {},
  },
  effects: {
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select((state) => state.global.notices.length);
      const unreadCount = yield select(
        (state) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select((state) =>
        state.global.notices.map((item) => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },

    // 获取用户信息 权限 路由 代理 账号
    *fetchCity(_, { call, put }) {
      const res = yield call(getUserInfo);
      if (res) {
        res.data.city = res.data.city.filter((x) => x.city != 810120 && x.city != 810121);
        // 用户信息
        const AGENT_TYPE = {
          0: [
            {
              id: 1,
              key: 1,
              value: '省级代理',
            },
            {
              id: 2,
              key: 2,
              value: '市级代理',
            },
            {
              id: 3,
              key: 3,
              value: '租赁公司',
            },
          ],
          1: [
            {
              id: 2,
              key: 2,
              value: '市级代理',
            },
            {
              id: 3,
              key: 3,
              value: '租赁公司',
            },
          ],
          2: [
            {
              id: 3,
              key: 3,
              value: '租赁公司',
            },
          ],
        };
        // 权限路由
        let menuData = null;
        let userAgentType = [];
        // 权限接口
        let userApiAuth = {};
        if (res.data.user) {
          const { agent_type } = res.data.user;
          userAgentType = AGENT_TYPE[`${agent_type}`];
        }
        let userCityCountyList = [];

        // 用户拥有的城市过滤
        if (res.data.own_city == -1) {
          userCityCountyList = res.data.city;
        } else {
          res.data.own_city.map((item) => {
            userCityCountyList.push(res.data.city.find((x) => x.city == item));
          });
        }

        // 用户拥有的路由权限
        if (res.data.user) {
          // 拥有的权限
          const permission = res.data.user.permission;
          // 需要隐藏的路由
          // const isHideInMenu = ['14', '9', '11', '102', '66', '132', '168'];
          const isHideInMenu = ['14', '9', '11', '102', '66', '132', '197', '184'];
          // 路由
          const baseRouter = [
            {
              path: '/welcome',
              name: '首页',
              icon: 'https://static.tonggangfw.net/saas/%E7%BD%91%E7%AB%99%E9%A6%96%E9%A1%B5.svg',
              locale: 'menu.welcome',
            },
          ];
          const tagRouter = permission.filter((x) => x.module === 'tag');
          tagRouter.map((tagItem) => {
            tagItem.path = `/${tagItem.uri}`;
            tagItem.locale = `menu.${tagItem.uri}`;
            tagItem.icon = `https://static.tonggangfw.net${tagItem.icon_url}`;

            let pageRouter = permission.filter((x) => x.sup_id === tagItem.id);
            pageRouter.map((x) => {
              x.path = `/${x.module}/${x.uri}`;
              x.locale = `menu.${tagItem.uri}.${x.uri}`;
              x.icon = `https://static.tonggangfw.net${x.icon_url}`;
              if (isHideInMenu.indexOf(x.id) > -1) {
                x.hideInMenu = true;
              }
            });
            tagItem.routes = pageRouter;
            if (tagItem.id == 5) {
              tagItem.routes.push({
                name: '公司信息',
                path: `/settings/company-information`,
                type: 'page',
                module: 'settings',
                uri: 'company-information',
                locale: `menu.settings.company-information`,
                icon: 'https://static.tonggangfw.net/saas/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86.svg',
                menu_order: -1,
              });
            }
            // 排序
            pageRouter.sort((x, y) => {
              return x.menu_order * 1 - y.menu_order * 1;
            });
          });
          menuData = baseRouter.concat(tagRouter);
          // console.log(menuData, '服务器路由');
          // 用户拥有的接口权限
          const userApiAuthArr = permission.filter((x) => (x.module === 'api' || x.module === 'pope'));
          Object.keys(userApiAuthArr);
          userApiAuthArr.map((item) => {
            userApiAuth[item.uri] = true;
          });
          // console.log(userApiAuth, '用户拥有的接口权限');
        }

        yield put({
          type: 'saveCityList',
          payload: {
            cityCountyList: res.data.city,
            userCityCountyList: userCityCountyList,
            userAgentType: userAgentType,
            userInfo: res.data.user,
            menuData: menuData,
            userApiAuth: userApiAuth,
            userCompany: res.data.company_list,
          },
        });
      }
    },

    // 保存手机号
    *saveDriverPhone({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },

    // 保存搜索项 加盟司机管理
    *saveJoinSearchValue({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 保存搜索项 意向司机列表
    *saveIntendedSearchValue({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },

    // 保存订单搜索项
    *saveOrderSearchValue({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 保存垫付列表搜索项
    *saveAdvancepaySearchValue({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
  },
  reducers: {
    merge(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 保存城市
    saveCityList(
      state = {
        // 所有城市及二级区县
        cityCountyList: [],
        // 用户可选列表
        userCityCountyList: [],
        // 用户角色
        userAgentType: [],
        // 用户信息
        userInfo: {},
        // 用户拥有页面
        menuData: [],
        // 用户拥有权限
        userApiAuth: {},
        // 用户拥有公司
        userCompany: [],
      },
      { payload },
    ) {
      return {
        ...state,
        cityCountyList: payload.cityCountyList,
        cityList: payload.cityList,
        userAgentType: payload.userAgentType,
        userCityCountyList: payload.userCityCountyList,
        userInfo: payload.userInfo,
        menuData: payload.menuData,
        userApiAuth: payload.userApiAuth,
        userCompany: payload.userCompany,
      };
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item) => item.type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
