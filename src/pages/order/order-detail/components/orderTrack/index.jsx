/* 订单轨迹组件 */
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';

import OrderProgress from './orderProgress';
import MapTrajectory from './mapTrajectory';
import { orderStep } from '../utils/orderStep';
import './index.less';
const { Sider, Content } = Layout;

const OrderTrack = (props) => {
  const { orderData, orderTrackInfo } = props;
  const { order_detail } = props.orderData;
  const { starting_name, dest_name } = props.orderData.order_detail;
  const [stepData, setStepData] = useState([]);
  const [destName] = useState(dest_name);
  const [startingName] = useState(starting_name);
  // 乘客起点经纬度
  const [pLatLng] = useState([
    {
      lat: (order_detail['乘客发单'] && order_detail['乘客发单'].new_lat) || false,
      lng: (order_detail['乘客发单'] && order_detail['乘客发单'].new_lng) || false,
      time: (order_detail['乘客发单'] && order_detail['乘客发单'].new_time) || false,
      title: '乘客发单',
      icon: 'https://static.tonggangfw.net/saas/map/passengers@2x.png',
      width: 67,
      height: 100,
    },
    {
      lat: order_detail.starting_lat,
      lng: order_detail.starting_lng,
      time: '--',
      title: '乘客订单起点',
      icon: 'https://static.tonggangfw.net/saas/map/orderstartingpoint@2x.png',
      width: 67,
      height: 100,
    },
    {
      lat: order_detail.dest_lat,
      lng: order_detail.dest_lng,
      time: '--',
      title: '乘客订单终点',
      icon: 'https://static.tonggangfw.net/saas/map/orderthefinish@2x.png',
      width: 67,
      height: 100,
    },
  ]);
  // 司机起点经纬度
  const [dLatLng] = useState([
    {
      lat: (order_detail['司机接单'] && order_detail['司机接单'].assigned_lat) || false,
      lng: (order_detail['司机接单'] && order_detail['司机接单'].assigned_lng) || false,
      time: (order_detail['司机接单'] && order_detail['司机接单'].assigned_time) || false,
      title: '司机接单',
      icon: 'https://static.tonggangfw.net/saas/map/driverorders@2x.png',
      width: 117,
      height: 61,
    },
    {
      lat: (order_detail['司机到达'] && order_detail['司机到达'].prepared_lat) || false,
      lng: (order_detail['司机到达'] && order_detail['司机到达'].prepared_lng) || false,
      time: (order_detail['司机到达'] && order_detail['司机到达'].prepared_time) || false,
      title: '司机到达',
      icon: 'https://static.tonggangfw.net/saas/map/driverarrived@2x.png',
      width: 117,
      height: 126,
    },
    {
      lat: (order_detail['服务开始'] && order_detail['服务开始'].begun_lat) || false,
      lng: (order_detail['服务开始'] && order_detail['服务开始'].begun_lng) || false,
      time: (order_detail['服务开始'] && order_detail['服务开始'].begun_time) || false,
      title: '开始计费',
      icon: 'https://static.tonggangfw.net/saas/map/startbilling@2x.png',
      width: 117,
      height: 61,
    },
    {
      lat: (order_detail['服务结束'] && order_detail['服务结束'].finished_lat) || false,
      lng: (order_detail['服务结束'] && order_detail['服务结束'].finished_lng) || false,
      time: (order_detail['服务结束'] && order_detail['服务结束'].finished_time) || false,
      title: '司机结束计费',
      icon: 'https://static.tonggangfw.net/saas/map/endofthebilling@2x.png',
      width: 151,
      height: 61,
    },
  ]);

  useEffect(() => {
    generateData();
  }, []);

  /**
   * @description: 初始化订单数据
   * @param {*}
   * @return {*}
   */
  const generateData = () => {
    let orderStepData = orderStep(order_detail, orderData);
    setStepData(orderStepData);
  };
  return (
    <Layout className="orderTrack">
      <Sider width={230} className="progress">
        <OrderProgress stepData={stepData} destName={destName} startingName={startingName} />
      </Sider>
      <Layout>
        <Content>
          <MapTrajectory
            destName={destName}
            startingName={startingName}
            pLatLng={pLatLng}
            dLatLng={dLatLng}
            orderTrackInfo={orderTrackInfo}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default React.memo(OrderTrack);
