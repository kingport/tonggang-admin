/*
 * @Author: your name
 * @Date: 2020-12-31 14:15:41
 * @LastEditTime: 2020-12-31 14:42:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\order\order-detail\components\orderModal\price.js
 */
export default class Price {
  constructor(driver_bill, passenger_bill) {
    this.driver_bill = driver_bill;
    this.passenger_bill = passenger_bill;
  }
  // 司机
  driverPrice() {
    return [
      {
        title: '基础费',
        key: 'd_start_price',
      },
      {
        title: '里程费',
        key: 'd_normal_fee',
        defaultDisabled: !this.driver_bill.d_normal_distance,
      },
      {
        title: '时长费',
        key: 'd_normal_time_fee',
        defaultDisabled: !this.driver_bill.d_normal_time,
      },
      {
        title: '远途费',
        key: 'd_empty_fee',
        defaultDisabled: !this.driver_bill.d_empty_distance,
      },
      {
        title: '高速费',
        key: 'd_highway_fee',
      },
      {
        title: '路桥费',
        key: 'd_bridge_fee',
      },
      {
        title: '停车费',
        key: 'd_park_fee',
      },
      {
        title: '其他费',
        key: 'd_other_fee',
      },
      {
        title: '信息费',
        key: 'info_fee',
        defaultDisabled: true,
      },
    ];
  }
  // 乘客
  passengerPrice() {
    return [
      {
        // 乘客司机部分参数根据返回设置默认disabled
        title: '基础费',
        key: 'p_start_price',
      },
      {
        title: '里程费',
        key: 'p_normal_fee',
        defaultDisabled: !this.passenger_bill.p_normal_distance,
      },
      {
        title: '时长费',
        key: 'p_normal_time_fee',
        defaultDisabled: !this.passenger_bill.p_normal_time,
      },
      {
        title: '远途费',
        key: 'p_empty_fee',
        defaultDisabled: !this.passenger_bill.p_empty_distance,
      },
      {
        title: '高速费',
        key: 'p_highway_fee',
      },
      {
        title: '路桥费',
        key: 'p_bridge_fee',
      },
      {
        title: '停车费',
        key: 'p_park_fee',
      },
      {
        title: '优惠券',
        key: 'p_coupon_fee',
        defaultDisabled: true,
      },
      {
        title: '其他费',
        key: 'p_other_fee',
      },
    ];
  }
}
