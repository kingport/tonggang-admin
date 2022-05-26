# 同仁系统

基于 React v16.8 + hooks + webpack 4 + antd-pro + less 构建同港针对供应商的 SAAS 系统

### Node 版本要求

`React + antd-pro` 需要 Node.js 10.0 或更高版本 你可以使用 [nvm](https://github.com/nvm-sh/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在同一台电脑中管理多个 Node 版本。

本项目 Node.js 12.18.1

### 启动项目

```bash

git clone https://gitlabsoff.tonggangfw.net/saas-platform/saas-tonggang.git

cd saas-tonggang

npm install or yarn

npm start or yarn start
```

### git 开发规范

```bash
开发分支创建格式 dingkun(姓名)/spring/20201010_XXXXX

测试环境分支 dev  发布测试环境用

生产环境 master  禁止直接在master上进行开发 保持master上永远干净
```

### 项目发布

```bash

测试环境发布 npm run deploy:dev (项目内已有自动发布脚本 详见deploy文件)

生产环境发布 npm run build 创建tag 标签： tag_2020100100_XXXXX 标签告知运维人员

```

### 项目开发规范

```bash
  页面文件夹命名规范 单词中横线间隔
  页面文件统一按照如下规范
  - [√ 页面目录]()
  - [√ components] 通用组件
  - [√ service.js] api接口
  - [√ constant.js] 各权限接口判断
  - [√ index.js] 页面统一入口
  方法 变量 命名统一驼峰
  utils文件夹 统一工具方法http
  services文件夹 统一全局api
```

### 项目流程

<p>
  <img src="https://gitlabsoff.tonggangfw.net/saas-platform/saas-tonggang/raw/dingkun/spring/20200923_capacityDriver/public/%E5%90%8C%E4%BB%81%E7%B3%BB%E7%BB%9F.png"  style="display:inline;">
</p>

### 项目接口文档

<p>
  <a href="http://api.docs.tonggangfw.net/web/#/24"  style="display:inline;">
  同仁系统接口文档
  </a>
</p>

### 项目可优化问题点记录
- 重复渲染问题 可使用ahooks useMemo

### <span id="top">项目功能（一期）</span>
- 开发分支 dev
- 发布分支 tag_202010141242_v1.0.3（最后修改完打包标签）
- 开发周期 2周
- 开发人员 wangdingkun（前端）fanqianxin（后端）

- √ Saas-tonggang 一期模块
- [√ 首页](#home)
- [√ 运力中心](#capacity)
  - [√ 邀请乘客配置模块]
  - [√ 邀请乘客列表模块]
  - [√ 优惠券活动列表模块]
  - [√ 系统发券列表模块]
- [√ 系统设置](#settings)
  - [√ 公司管理]
  - [√ 角色管理]
  - [√ 用户管理]

### <span id="top">项目功能（二期）</span>

- 开发分支 dingkun/spring/20200923_capacityDriver
- 发布分支 tag_202012251004_plateNo （最后修改完毕打包标签）
- 开发周期 3个月
- 开发人员 wangdingkun（前端）zengjiajie（后端）

- √ Saas-tonggang 二期模块主要开发功能
- [√ 运力中心](#capacity)
  - [√ 加盟司机管理]
  - [√ 邀请司机列表]
  - [√ 意向司机列表]
  - [√ 新增司机]
- [√ 系统设置](#settings)
  - [√ 公司信息]
- [√ 配置中心](#)
  - [√ 取消费配置]
  - [√ 招募奖励配置]
  - [√ 邀请乘客入口配置]
  - [√ 邀请司机入口入口配置]

### <span id="top">项目功能（三期）</span>

- 开发分支 dingkun/spring/202012211253_orderCenter
- 发布分支 tag_202012301426_orderCenter
- 开发周期 10天
- 开发人员 wangdingkun（前端）zengjiajie（后端）

- √ Saas-tonggang 三期模块主要开发功能
- [√ 订单中心](#order)
  - [√ 客服工具]
    - [√ 查询订单数据]
  - [√ 垫付列表]
  - [√ 订单详情]
    - [√ 订单轨迹]
    - [√ 账单费用]
    - [√ 垫付记录]
    - [√ 操作历史]

### <span id="top">项目功能（四期）</span>
- 开发分支 dingkun/spring/202012301513_fullTimeDriver
- 发布分支 tag_202012301426_orderCenter
- 开发周期 10天
- 开发人员 wangdingkun（前端）zengjiajie（后端）wuyang（后端）

- √ Saas-tonggang 四期模块主要开发功能
- [√ 运力中心](#capacity)
  - [√ 全职司机管理]
    - [√ 设置兼职司机]
    - [√ 设置全职司机]# tonggang-admin
# tonggang-admin
