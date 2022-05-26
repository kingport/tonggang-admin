// 优惠券类型
export const ticketType = [
  {
    id: 1,
    key: 1,
    value: '邀请赠券',
  },
  {
    id: 10,
    key: 10,
    value: '注册赠券',
  },
];
// 发放平台
export const PlatformList = [
  {
    id: 1,
    key: 1001,
    value: '同港',
  },
  // {
  //   id: 2,
  //   key: 2,
  //   value: '五快五',
  // },
];
export const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
// 优惠券类型
export const statusList = [
  {
    id: 1,
    key: 1,
    value: '已使用',
  },
  {
    id: 2,
    key: 0,
    value: '未使用',
  },
  {
    id: 3,
    key: 2,
    value: '已过期',
  },
];
// 公司模块
// 代理商类型
export const AGENT_TYPE = [
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
];
export const AGENT_TYPE_NAME = {
  1: '省级代理',
  2: '市级代理',
  3: '租赁公司',
};
// 合作模式
export const COOPERATION_MODE = [
  {
    id: 1,
    key: 1,
    value: '直营',
  },
  {
    id: 2,
    key: 2,
    value: '代理b(有运营能力+运力)',
  },
  {
    id: 3,
    key: 3,
    value: '代理c(只提供运力)',
  },
];
export const COOPERATION_MODE_NAME = {
  1: '直营',
  2: '代理b(有运营能力+运力)',
  3: '代理c(只提供运力)',
};
// 运力属性
export const TRANSPORT_PROPERTIES = [
  {
    id: 1,
    key: 1,
    value: '公海',
  },
  {
    id: 2,
    key: 2,
    value: '非公海',
  },
];
export const STATUS_COMPANY = [
  {
    id: 0,
    key: 0,
    value: '合作中',
  },
  {
    id: 1,
    key: 1,
    value: '已终止',
  },
  {
    id: 2,
    key: 2,
    value: '已删除',
  },
];
// 平台
export const CHANNEL = {
  1001: '同港',
};
// 优惠券类型
export const COUPON_TYPE = {
  1: '邀请赠券',
  2: '系统赠券',
  10: '注册赠券',
};
// 领取方式
export const GET_TYPE = {
  1: '司机邀请',
};
export const COUPON_STAUTS = {
  0: '待审核',
  1: '审核不通过',
  2: '审核通过',
  3: '已暂停',
  4: '已终止',
  5: '已过期',
};
export const COUPON_TEXT = {
  0: '未使用',
  1: '已使用',
  2: '已过期',
};
// 账号状态
export const ACCOUNT_STATUS = {
  0: {
    label: '正常',
    status: 'success',
  },
  1: {
    label: '已删除',
    status: 'error',
  },
};
export const CONFIG_PASSENGER_STATUS = {
  1: {
    label: '开启',
    status: 'success',
  },
  2: {
    label: '关闭',
    status: 'error',
  },
};
///////////////////////////////////////////////-----配置中心模块--------/////////////////////////////////////

export const CONFIG_CHANNEL = {
  10000: '滴滴',
  10200: '百度',
  10300: '腾讯',
  10100: '美团',
  1001: '同港',
};
export const CANCEL_CONFIGURATION = {
  1001: '同港',
  10000: '滴滴',
  10200: '百度',
};
export const CONFIG_CITY_PRICE_STATUS = {
  1: '待审核',
  2: '审核通过',
  3: '审核不通过',
  4: '终止',
};
export const CONFIG_CITY_PRICE_TYPE = {
  1: '快车',
};

//////////////////////////////////////////////-----加盟司机管理模块-----////////////////////////////////////
// 绑定状态
export const DRIVER_BIND_STATUS = {
  1: '已绑定',
  2: '未绑定',
};
// 账户状态 正常、冻结、封禁、永久封禁、异常
export const DRIVER_ACCOUNT_STATUS = {
  1: '正常',
  // 2: '冻结',
  3: '封禁',
  4: '永久封禁',
  5: '证件过期',
};
// 审核
export const DRIVER_AUDIT_STATUS = {
  0: {
    value: '待审查',
  },
  1: {
    value: '审核通过',
  },
  2: {
    value: '初审不通过',
  },
  3: {
    value: '非运营车辆',
  },
  // 4: {
  //   value: '完单',
  // },
};
// 认证状态
export const DRIVER_AUTHENTICATION_STATUS = {
  // 0: {
  //   value: '未认证',
  // },
  1: {
    value: '仅人证',
  },
  2: {
    value: '仅车证',
  },
  3: {
    value: '双证齐全',
  },
  4: {
    value: '双证缺失',
  },
};
// 渠道
export const DRIVER_CHANNEL_STATUS = {
  0: {
    value: '后台上传',
  },
  2: {
    value: '官方入口',
  },
  3: {
    value: '官方短信',
  },
  4: {
    value: '线下海报',
  },
  5: {
    value: '司机邀请-海报',
  },
  6: {
    value: '司机邀请-短信',
  },
  7: {
    value: '公司邀请',
  },
};
// 加入源
export const DRIVER_THE_SOURCE = {
  // 0: {
  //   value: '直营',
  // },
  1: {
    value: '个人加盟',
  },
  2: {
    value: '所属公司',
  },
};
// 司机性别
export const DRIVER_GENDER = {
  1: {
    value: '男',
  },
  2: {
    value: '女',
  },
};
// 驾照类型 A1、A2、A3、B1、B2、C1、C2
export const DRIVER_LICENSE_LEVEL = {
  1: {
    value: 'A1',
  },
  2: {
    value: 'A2',
  },
  3: {
    value: 'A3',
  },
  4: {
    value: 'B1',
  },
  5: {
    value: 'B2',
  },
  6: {
    value: 'C1',
  },
  7: {
    value: 'C2',
  },
};
// 车辆能源类型 1-油,2-电,3-油电混合,4-油电混合插电式,5-油电混合非插电式, 6-其他
export const DRIVER_CAR_ENERGY = {
  1: {
    value: '油',
  },
  2: {
    value: '电',
  },
  3: {
    value: '油电混合',
  },
  4: {
    value: '油电混合插电式',
  },
  5: {
    value: '油电混合非插电式',
  },
  0: {
    value: '其他',
  },
};
// 车辆性质 1-本人车辆，2-租赁车辆
export const DRIVER_CAR_NATURE = {
  0: {
    value: '本人车辆',
  },
  1: {
    value: '租赁车辆',
  },
};
// 车辆颜色 1黑色、2银色、3灰色、4白色、5红色、6金色、7蓝色、8棕色、9紫色、10绿色、11粉色、12黄色、13橙色

export const DRIVER_CAR_COLOR = {
  1: {
    value: '黑色',
  },
  2: {
    value: '白色',
  },
  3: {
    value: '蓝色',
  },
  4: {
    value: '红色',
  },
  5: {
    value: '银色',
  },
  6: {
    value: '灰色',
  },
  7: {
    value: '金色（香槟/米色）',
  },
  8: {
    value: '棕色（咖啡/褐色）',
  },
  9: {
    value: '紫色',
  },
  10: {
    value: '绿色',
  },
  11: {
    value: '粉色',
  },
  12: {
    value: '黄色',
  },
  13: {
    value: '橙色',
  },
};

// 司机招募配置
export const INVITER_ACTIVE_STATUS = {
  0: {
    value: '待审核',
  },
  1: {
    value: '审核通过',
  },
  2: {
    value: '审核不通过',
  },
  3: {
    value: '已终止',
  },
  4: {
    value: '已过期',
  },
};

////////////////////////////////////////////--------取消费配置--------/////////////////////////////
export const CONFIG_CANCEL_STATUS = {
  1: {
    value: '开启',
  },
  0: {
    value: '关闭',
  },
};

////////////////////////////////////////////--------订单中心--------/////////////////////////////
export const ORDER_CENTER_ADVANCE = {
  '-1': { value: '全部' },
  1: { value: '待审核' },
  2: { value: '已驳回' },
  3: { value: '已垫付' },
  4: { value: '乘客已支付' },
};
export const ORDER_CENTER_CHANNEL = {
  1: { value: '同港安卓端' },
  10100: { value: '美团' },
  102: { value: '同港IOS端' },
  // 20000: { value: '五快五小程序端' },
  10200: { value: '百度' },
  10300: { value: '腾讯' },
  10000: { value: '滴滴' },
  103: { value: '同港小程序端' },
  1001: { value: '同港' },
};
export const ORDER_CITYPRICE_CHANNEL = {
  10000: { value: '滴滴' },
  10100: { value: '美团乘客端' },
  10200: { value: '百度乘客端' },
  10300: { value: '腾讯乘客端' },
  1001: { value: '同港' },
  // 20000: { value: '五快五小程序端' },
};
////////////////////////////////////////////--------风控中心--------/////////////////////////////
export const RISK_CONTROL_CANCEL = {
  // 0: { value: '未判责' },
  1: { value: '有责' },
  2: { value: '无责' },
  // 20000: { value: '五快五小程序端' },
};
////////////////////////////////////////////--------财务中心--------/////////////////////////////
export const FINANCE_STATUS = {
  0: '待开票',
  1: '已开票',
  2: '待冲红',
  3: '已冲红',
}

// 车辆来源
export const DRIVER_SOUCER_STATUS = {
  1: {value: '注册带入'},
  2: {value: '后台新增'},
  3: {value: '端内换车'},
  4: {value: '被替换车辆'},
}
// 司机绑定状态
export const DRIVER_BOUND_STATUS = {
  1: {value: '已绑定'},
  0: {value: '未绑定'},
}
// 车辆审核状态
export const DRIVER_CHECK_STATUS = {
  0: {value: '待审核'},
  1: {value: '审核通过'},
  2: {value: '审核不通过'},
  3: {value: '非营运车辆'},
}