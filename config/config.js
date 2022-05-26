import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {
    compact: true, // 开启紧凑主题
  },
  dva: {
    hmr: true,
  },
  analyze: {
    analyzerPort: 8686,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    chrome: 79,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
    ie: 11,
  },
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },

  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            // 网站首页
            {
              path: '/welcome',
              name: 'welcome',
              component: './Welcome',
            },
            // 运力中心
            {
              path: '/capacity',
              name: 'capacity',
              routes: [
                // 加盟司机管理
                {
                  name: 'join',
                  path: '/capacity/join',
                  component: './capacity/join',
                },
                // 新增 查看 编辑 审核 司机页
                {
                  name: 'join-new',
                  path: '/capacity/join-new',
                  hideInMenu: true,
                  component: './capacity/join-new',
                },
                // 邀请司机列表
                {
                  name: 'invited-driver-manage',
                  path: '/capacity/invited-driver-manage',
                  component: './capacity/invited-driver-manage',
                },
                // 邀请司机管理详情
                {
                  name: 'invited-driver-detail',
                  path: '/capacity/invited-driver-detail/:id',
                  hideInMenu: true,
                  component: './capacity/invited-driver-detail',
                },
                // 邀请乘客列表
                {
                  name: 'invited-passenger-list',
                  path: '/capacity/invited-passenger-list',
                  component: './capacity/invited-passenger-list',
                },
                // 邀请乘客详情
                {
                  name: 'invited-passenger-detail',
                  path: '/capacity/invited-passenger-detail/:id',
                  hideInMenu: true,
                  component: './capacity/invited-passenger-detail',
                },
                // 优惠券活动列表
                {
                  name: 'ticket-list',
                  path: '/capacity/ticket-list',
                  component: './capacity/ticket-list',
                },
                // 优惠券详情
                {
                  name: 'detail',
                  path: '/capacity/detail/:id',
                  hideInMenu: true,
                  component: './capacity/detail',
                },
                // 系统发券列表
                {
                  name: 'system-list',
                  path: '/capacity/system-list',
                  component: './capacity/system-list',
                },
                // 意向司机列表
                {
                  name: 'intended-drivers-list',
                  path: '/capacity/intended-drivers-list',
                  component: './capacity/intended-drivers-list',
                },
                // 全职司机列表
                {
                  name: 'full-time-driver',
                  path: '/capacity/full-time-driver',
                  component: './capacity/full-time-driver',
                },
                // 疫情打卡记录
                {
                  name: 'epidemic-record',
                  path: '/capacity/epidemic-record',
                  component: './capacity/epidemic-record',
                },
                // 司机车辆列表
                {
                  name: 'driver-car-list',
                  path: '/capacity/driver-car-list',
                  component: './capacity/driver-car-list',
                },
                // 新增车辆
                {
                  name: 'add-car',
                  path: '/capacity/add-car',
                  component: './capacity/add-car',
                },
              ],
            },
            // 数据中心
            {
              path: '/datacenter',
              name: 'datacenter',
              routes: [
                // 运营概况
                {
                  name: 'operation-manage',
                  path: '/datacenter/operation-manage',
                  component: './datacenter/operation-manage',
                },
                // 订单费用数据
                {
                  name: 'order-cost',
                  path: '/datacenter/order-cost',
                  component: './datacenter/order-cost',
                },
                // 司机出车数据
                {
                  name: 'driver-car',
                  path: '/datacenter/driver-car',
                  component: './datacenter/driver-car',
                },
              ],
            },
            // 配置中心
            {
              path: '/configuration',
              name: 'configuration',
              routes: [
                // 取消配置
                {
                  name: 'cancel-configuration',
                  path: '/configuration/cancel-configuration',
                  component: './configuration/cancel-configuration',
                },
                // 邀请乘客入口配置
                {
                  name: 'invited-passenger-config',
                  path: '/configuration/invited-passenger-config',
                  component: './configuration/invited-passenger-config',
                },
                // 招募奖励配置
                {
                  name: 'invited-driver-rewards',
                  path: '/configuration/invited-driver-rewards',
                  component: './configuration/invited-driver-rewards',
                },
                // 邀请司机配置
                {
                  name: 'invited-driver-config',
                  path: '/configuration/invited-driver-config',
                  component: './configuration/invited-driver-config',
                },
                // 城市计价配置
                {
                  name: 'city-price',
                  path: '/configuration/city-price',
                  component: './configuration/city-price',
                },
                // 计价日历配置
                {
                  name: 'calendar-config',
                  path: '/configuration/calendar-config',
                  component: './configuration/calendar-config',
                },
                // 开城配置
                {
                  name: 'open-city',
                  path: '/configuration/open-city',
                  component: './configuration/open-city',
                },
                // 活动查询
                {
                  name: 'team-search',
                  path: '/configuration/team-search',
                  component: './configuration/team-search',
                },
                // 消息推送
                {
                  name: 'message-push',
                  path: '/configuration/message-push',
                  component: './configuration/message-push',
                },
                // 司机标签管理
                {
                  name: 'driver-tag-manage',
                  path: '/configuration/driver-tag-manage',
                  component: './configuration/driver-tag-manage',
                },
                // 司机取消次数配置
                {
                  name: 'driver-cancel',
                  path: '/configuration/driver-cancel',
                  component: './configuration/driver-cancel',
                },
                // 用户城市权限配置
                {
                  name: 'city-user-auth',
                  path: '/configuration/city-user-auth',
                  component: './configuration/city-user-auth',
                },
              ],
            },
            // 财务中心
            {
              path: '/finance',
              name: 'finance',
              routes: [
                // 司机账户管理
                {
                  name: 'driver-manage',
                  path: '/finance/driver-manage',
                  component: './finance/driver-manage',
                },
                // 奖励账户管理
                {
                  name: 'award-account-management',
                  path: '/finance/award-account-management',
                  component: './finance/award-account-management',
                },
                // 发票管理
                {
                  name: 'invoice-manage',
                  path: '/finance/invoice-manage',
                  component: './finance/invoice-manage',
                },
                // 发票详情
                {
                  name: 'invoice-detail',
                  path: '/finance/invoice-detail',
                  component: './finance/invoice-detail',
                },
              ],
            },
            // 订单中心
            {
              path: '/order',
              name: 'order',
              routes: [
                // 客服工具
                {
                  name: 'customer-tool',
                  path: '/order/customer-tool',
                  component: './order/customer-tool',
                },
                // 垫付列表
                {
                  name: 'advancepay-list',
                  path: '/order/advancepay-list',
                  component: './order/advancepay-list',
                },
                // 订单详情
                {
                  name: 'order-detail',
                  path: '/order/order-detail',
                  component: './order/order-detail',
                },
              ],
            },
            // 风控中心
            {
              path: '/riskcontrol',
              name: 'riskcontrol',
              routes: [
                // 注销账户
                {
                  name: 'close-account',
                  path: '/riskcontrol/close-account',
                  component: './riskcontrol/close-account',
                },
                // 解除风控
                {
                  name: 'relieve-control',
                  path: '/riskcontrol/relieve-control',
                  component: './riskcontrol/relieve-control',
                },
                // 飞单列表
                {
                  name: 'fly-order',
                  path: '/riskcontrol/fly-order',
                  component: './riskcontrol/fly-order',
                },
                // 取消管控
                {
                  name: 'cancel-controls',
                  icon:
                    'https://static.tonggangfw.net/saas/%E5%85%AC%E5%8F%B8%E7%AE%A1%E7%90%86.svg',
                  path: '/riskcontrol/cancel-controls',
                  component: './riskcontrol/cancel-controls',
                },
              ],
            },
            // 系统设置
            {
              path: '/settings',
              name: 'settings',
              routes: [
                // 公司信息
                {
                  name: 'company-information',
                  path: '/settings/company-information',
                  component: './settings/company-information',
                },
                // 公司管理
                {
                  name: 'company',
                  path: '/settings/company',
                  component: './settings/company',
                },
                {
                  name: 'company-new',
                  path: '/settings/company-new',
                  component: './settings/company-new',
                  hideInMenu: true,
                },
                // 角色管理
                {
                  name: 'role',
                  path: '/settings/role',
                  component: './settings/role',
                },
                // 用户管理
                {
                  name: 'consumer',
                  path: '/settings/consumer',
                  component: './settings/consumer',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],

  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  history: { type: 'hash' },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  extraBabelPlugins: [['transform-remove-console', { exclude: ['error', 'info', 'log'] }]],
});
