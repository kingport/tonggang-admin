/*
 * @Author: your name
 * @Date: 2020-12-22 14:31:06
 * @LastEditTime: 2021-02-23 16:29:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\order\order-detail\components\orderTrack\orderStep.js
 */
export const orderStep = (orderDetail, orderData) => {
  const { pre_map_type, begun_map_type, price_mode } = orderData;
  const stepData = [];
  const dataName = [
    '乘客发单',
    '司机接单',
    '司机到达',
    '乘客抢单后取消',
    '服务开始',
    '服务结束',
    '客服关单',
  ];
  const keyName = Object.keys(orderDetail);
  dataName.map((item) => {
    if (orderDetail[item]) {
      const itemData = orderDetail[item];
      // 乘客发单
      if (item === '乘客发单') {
        stepData.push({
          title: item,
          time: itemData.new_time || '',
          params: [
            {
              key: '预估里程',
              value: `${itemData.start_dest_distance || 0.0}公里`,
            },
            {
              key: price_mode == 0 ? '基础预估价格' : '预估一口价',
              value: `${itemData.pre_total_fee || 0.0}元`,
            },
            {
              key: '预估使用地图',
              value: `${pre_map_type == '0' ? '腾讯地图' : '滴滴地图'}`,
            },
            {
              key: '开始计费使用地图',
              value: `${begun_map_type == '0' ? '腾讯地图' : '滴滴地图'}`,
            },
          ],
        });
      }
      // 乘客发单后取消
      if (item === '乘客发单' && ['6'].indexOf(orderData.order_status) > -1) {
        stepData.push({
          title: orderData.order_status_name,
          params: [
            {
              key: '取消时间',
              value: orderData.order_detail.cancelled_time,
            },
          ],
        });
      }
      // 司机接单
      if (item === '司机接单') {
        stepData.push({
          title: item,
          time: itemData.assigned_time,
          params: [
            {
              key: '接单司机',
              value: itemData.driver_name,
            },
            {
              key: '车 牌 号',
              value: itemData.plate_no,
            },
            {
              key: '车      型',
              value: itemData.brand_name,
            },
            {
              key: '联系电话',
              value: itemData.driver_phone,
            },
          ],
        });
        // 司机接单后司机取消
        if (
          item === '司机接单' &&
          ['12'].indexOf(orderData.order_status) > -1 &&
          keyName.indexOf('司机到达') == -1
        ) {
          stepData.push({
            title: orderData.order_status_name,
            params: [
              {
                key: '取消时间',
                value: orderData.order_detail.cancelled_time,
              },
            ],
          });
        }
        // 司机接单后乘客取消
        if (
          item === '司机接单' &&
          ['7'].indexOf(orderData.order_status) > -1 &&
          keyName.indexOf('司机到达') == -1
        ) {
          stepData.push({
            title: orderData.order_status_name || '--',
            params: [
              {
                key: '取消时间',
                value: orderData.order_detail.cancelled_time,
              },
            ],
          });
        }
      }

      // 司机到达后 乘客司机 均可取消
      if (item === '司机到达') {
        stepData.push({
          title: item,
          time: itemData.prepared_time,
          params: [],
        });
        // 司机到达后司机取消
        if (item === '司机到达' && ['12'].indexOf(orderData.order_status) > -1) {
          stepData.push({
            title: orderData.order_status_name,
            params: [
              {
                key: '取消时间',
                value: orderData.order_detail.cancelled_time,
              },
            ],
          });
        }
        // 司机到达后乘客取消
        if (item === '司机到达' && ['7'].indexOf(orderData.order_status) > -1) {
          stepData.push({
            title: orderData.order_status_name || '--',
            params: [
              {
                key: '取消时间',
                value: orderData.order_detail.cancelled_time,
              },
            ],
          });
        }
      }

      // 服务开始
      if (item === '服务开始') {
        stepData.push({
          title: item,
          time: itemData.begun_time,
          params: [
            {
              key: '车      型',
              value: itemData.brand_name,
            },
            {
              key: '联系电话',
              value: itemData.driver_phone,
            },
          ],
        });
      }
      // 服务结束
      if (item === '服务结束') {
        stepData.push({
          title: item,
          time: itemData.finished_time,
          params: [
            {
              key: '订单时长',
              value: `${itemData.normal_time || 0}分钟`,
            },
            {
              key: '行驶里程',
              value: `${itemData.distance || 0.0}公里`,
            },
            {
              key: '支付状态',
              value: `${itemData.is_pay === '1' ? '已支付' : '未支付'}`,
            },
            {
              key: '账单费用',
              value: `${itemData.total_fee * 1 || 0.0}元`,
            },
          ],
        });
      }
      // 客服关单
      if (item === '客服关单' && ['11'].indexOf(orderData.order_status) > -1) {
        stepData.push({
          title: item,
          time: '',
          params: [
            {
              key: '关单时间',
              value: orderData.order_detail.cancelled_time,
            },
          ],
        });
      }
    }
    return item;
  });

  return stepData;
};
