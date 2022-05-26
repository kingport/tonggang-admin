import React, { useEffect } from 'react';
import { Card } from 'antd';
let map;
let d_marker;
let d_markers;
const OpenCityMap = () => {
  // 已开通城市
  const geoCoordMap = [
    {
      name: '重庆',
      lng: 106.550464,
      lat: 29.563761,
      icon: require('@/assets/point.png'),
    },
    {
      name: '东莞',
      lng: 113.746262,
      lat: 23.046237,
      icon: require('@/assets/point.png'),
    },
    {
      name: '长沙',
      lng: 112.938888,
      lat: 28.228272,
      icon: require('@/assets/point.png'),
    },
    {
      name: '合肥',
      lng: 117.227308,
      lat: 31.82057,
      icon: require('@/assets/point.png'),
    },
    {
      name: '扬州',
      lng: 119.421003,
      lat: 32.393159,
      icon: require('@/assets/point.png'),
    },
    {
      name: '常州',
      lng: 119.946973,
      lat: 31.772752,
      icon: require('@/assets/point.png'),
    },
    {
      name: '广州',
      lng: 113.264385,
      lat: 23.129112,
      icon: require('@/assets/point.png'),
    },
    {
      name: '哈尔滨',
      lng: 126.535319,
      lat: 45.803131,
      icon: require('@/assets/point.png'),
    },
    {
      name: '青岛',
      lng: 120.374402,
      lat: 36.168923,
      icon: require('@/assets/point.png'),
    },
    {
      name: '徐州',
      lng: 117.184811,
      lat: 34.261792,
      icon: require('@/assets/point.png'),
    },
    {
      name: '无锡',
      lng: 120.301663,
      lat: 31.574729,
      icon: require('@/assets/point.png'),
    },
    {
      name: '泰州',
      lng: 119.980546,
      lat: 32.528857,
      icon: require('@/assets/point.png'),
    },
    {
      name: '上饶',
      lng: 117.971185,
      lat: 28.44442,
      icon: require('@/assets/point.png'),
    },
    {
      name: '中山',
      lng: 116.394407,
      lat: 39.910707,
      icon: require('@/assets/point.png'),
    },
  ];
  // {
  //   // : [106.54, 29.59],
  //   // 珠海: [106.54, 29.59],
  //   // 太原: [106.54, 29.59],
  //   // 海口: [106.54, 29.59],
  //   // 泸州: [106.54, 29.59],
  //   // 南通: [106.54, 29.59],
  //   // 阜阳: [106.54, 29.59],
  //   // 柳州: [106.54, 29.59],
  //   // 三亚: [106.54, 29.59],
  //   // 成都: [106.54, 29.59],
  //   // 乐山: [106.54, 29.59],
  //   // 佛山: [106.54, 29.59],
  //   // 苏州: [106.54, 29.59],
  //   // 深圳: [106.54, 29.59],
  //   // 武汉: [106.54, 29.59],
  //   // 杭州: [106.54, 29.59],
  //   // 宁波: [106.54, 29.59],
  //   // 嘉兴: [106.54, 29.59],
  //   // 金华: [106.54, 29.59],
  //   // 温州: [106.54, 29.59],
  //   // 上海: [106.54, 29.59],
  //   // 天津: [106.54, 29.59],
  //   // 大庆: [106.54, 29.59],
  //   // 遵义: [106.54, 29.59],
  //   // 菏泽: [106.54, 29.59],
  //   // 昆明: [106.54, 29.59],
  //   // 盐城: [106.54, 29.59],
  // };

  useEffect(() => {
    d_markers = [];
    initPage();
  }, []);

  const initPage = () => {
    map = new AMap.Map('main', {
      zoom: 5,
      center: [116.408967, 39.880101], //默认中心(订单起点)
      resizeEnable: true,
      mapStyle: 'amap://styles/a7fb19b35d6c482c0682d19112514d4c',
      zoomEnable: false,
    });
    var scale = new AMap.Scale({
      visible: false,
    });
    map.addControl(scale);
    pointInit(map, geoCoordMap);
  };

  // 渲染点位
  const pointInit = (map, geoCoordMap) => {
    geoCoordMap.map((item) => {
      if (item.lat && item.lng) {
        // 创建司机起点图标
        var dPosition = new AMap.LngLat(item.lng, item.lat);
        // 司机点标记显示内容，
        var startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(40, 40),
          // 图标的取图地址
          image: item.icon,
          // 图标所用图片大小
          imageSize: new AMap.Size(40, 40),
        });
        d_marker = new AMap.Marker({
          topWhenClick: true,
          // draggable: true,
          position: dPosition,
          // 将 html 传给 content
          icon: startIcon,
          offset: new AMap.Pixel(-15, -30),
          // 以 icon 的 [center bottom] 为原点
          // offset: new AMap.Pixel(-1 * (item.width / 2), -1 * item.height),
          // offset: new AMap.Pixel(0, 0),
        });
        d_marker.setTitle(`开通城市: ${item.name}`);
        d_markers.push(d_marker);
      }
    });
    map.add(d_markers);
  };

  return (
    <Card>
      <div id="main" style={{ width: '100%', height: 600 }}></div>
    </Card>
  );
};

export default OpenCityMap;
