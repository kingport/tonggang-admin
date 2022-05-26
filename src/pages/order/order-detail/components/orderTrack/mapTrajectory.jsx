import React, { useState, useEffect } from 'react';
import { Spin, Checkbox, Affix, Space } from 'antd';
import moment from 'moment';
let map;
let d_marker;
let d_markers = [];

let p_marker;
let p_markers = [];

var mass;
var ruler;
var driving;
var pathSimplifierIns = null;
const MapTrajectory = (props) => {
  const { pLatLng, dLatLng, destName, startingName, orderTrackInfo } = props;

  const [trackType, setTrackType] = useState(['driverTrack']);
  useEffect(() => {
    d_markers = [];
    p_markers = [];
    initPage();
  }, []);

  /**
   * @description: 创建地图实例
   * @param {*}
   * @return {*}
   */
  const initPage = () => {
    map = new AMap.Map('container', {
      zoom: 12,
      center: [pLatLng[1].lng * 1, pLatLng[1].lat * 1], //默认中心(订单起点)
      resizeEnable: true,
    });
    var scale = new AMap.Scale({
      visible: true,
    });
    var toolBar = new AMap.ToolBar({
      visible: true,
      position: {
        top: '110px',
        right: '40px',
      },
    });
    map.addControl(scale);
    map.addControl(toolBar);
    // 存在司机点
    if (dLatLng[0].lat && dLatLng[0].lng) {
      setDriverMapPoint(map, dLatLng);
    }
    // 订单轨迹
    // getOrderPoint(map);

    if (orderTrackInfo.trackPoints) {
      getOrderPoint(map);
    }
  };

  /**
   * @description: 司机标记点位创建 开始计费点位 司机接单 司机达到 司机结束计费
   * @param {*}
   * @return {*}
   */
  const setDriverMapPoint = (map, dLatLng) => {
    dLatLng.map((item) => {
      if (item.lat && item.lng) {
        // 创建司机起点图标
        var dPosition = new AMap.LngLat(item.lng, item.lat);
        // 司机点标记显示内容，
        var startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(item.width, item.height),
          // 图标的取图地址
          image: item.icon,
          // 图标所用图片大小
          imageSize: new AMap.Size(item.width, item.height),
        });
        d_marker = new AMap.Marker({
          topWhenClick: true,
          // draggable: true,
          position: dPosition,
          // 将 html 传给 content
          icon: startIcon,
          // anchor: new AMap.Pixel(item.width / 2, item.height),
          // 以 icon 的 [center bottom] 为原点
          offset: new AMap.Pixel(-1*(item.width / 2), -1* item.height),
          // offset: new AMap.Pixel(0, 0),

        });
        d_marker.setTitle(`${item.title}: ${[item.lng * 1, item.lat * 1]} 时间:${item.time}`);
        d_markers.push(d_marker);
      }
    });
    map.add(d_markers);
  };

  /**
   * @description: 乘客标记点位创建 订单开始 订单结束位置 乘客发单位置
   * @param {*}
   * @return {*}
   */
  const setPassengerMapPoint = (map, pLatLng) => {
    pLatLng.map((item, index) => {
      if (item.lat && item.lng) {
        // 创建乘客起点图标
        var pPosition = new AMap.LngLat(item.lng, item.lat);
        // 司机点标记显示内容，
        var startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(item.width, item.height),
          // 图标的取图地址
          image: item.icon,
          // 图标所用图片大小
          imageSize: new AMap.Size(item.width, item.height),
        });
        p_marker = new AMap.Marker({
          topWhenClick: true,
          // draggable: true,
          position: pPosition,
          // 将 html 传给 content
          icon: startIcon,
          // 以 icon 的 [center bottom] 为原点
          // offset: new AMap.Pixel(-13, -30),
          // anchor: new AMap.Pixel(item.width / 2, item.height),
          // offset: new AMap.Pixel(0, 0),
          offset: new AMap.Pixel(-1*(item.width / 2), -1* item.height),

        });
        p_marker.setTitle(`${item.title}: ${[item.lng * 1, item.lat * 1]} 时间:${item.time}`);
        p_markers.push(p_marker);
      }
    });
    // 将 司机起点图标 添加到地图
    map.add(p_markers);
  };

  /**
   * @description: 删除点位 乘客or司机
   * @param {*}
   * @return {*}
   */
  const removeRolePoint = (type) => {
    if (type == 'driver') {
      // 删除点标记
      map.remove(d_markers);
      if (orderTrackInfo.trackPoints) {
        mass.hide();
      }
    }
    if (type == 'passenger') {
      // 删除点标记
      map.remove(p_markers);
    }
    if (type == 'direction') {
      if (pathSimplifierIns) {
        pathSimplifierIns.setData([]);
      }
    }
  };

  /**
   * @description: 获取订单轨迹点位
   * @param {*}
   * @return {*}
   */
  const getOrderPoint = (map) => {
    const trackPoints = orderTrackInfo.trackPoints;
    let citys = [];
    Object.keys(trackPoints).map((key) => {
      let obj = {
        lnglat: [trackPoints[key]['loc:lng'], trackPoints[key]['loc:lat']],
        name: `${trackPoints[key]['loc:lng']},${trackPoints[key]['loc:lat']}`,
        time: moment(key.slice(key.lastIndexOf('_') + 1, key.length) * 1000).format(
          'YYYY/MM/DD HH:mm:ss',
        ),
        style: 0,
      };
      citys.push(obj);
    });
    var style = [
      {
        url: 'https://static.tonggangfw.net/saas/map/passengerslot@2x.png',
        anchor: new AMap.Pixel(6, 6),
        size: new AMap.Size(11, 11),
      },
    ];
    mass = new AMap.MassMarks(citys, {
      opacity: 0.8,
      zIndex: 111,
      cursor: 'pointer',
      style: style,
    });
    var marker = new AMap.Marker({ content: ' ', map: map });
    mass.on('mouseover', function (e) {
      marker.setPosition(e.data.lnglat);
      marker.setLabel({ content: e.data.name + '时间:' + e.data.time });
    });
    mass.setMap(map);
  };

  /**
   * @description: 轨迹变换, 对应的左侧进度和右侧地图都需要刷新
   * @param {*}
   * @return {*}
   */
  const onChangeTrack = (checkedValues) => {
    setTrackType(checkedValues);
    if (checkedValues.find((x) => x == 'driverTrack')) {
      if (dLatLng[0].lat && dLatLng[0].lng) {
        setDriverMapPoint(map, dLatLng);
      }
      if (orderTrackInfo.trackPoints) {
        mass.show();
      }
    } else {
      removeRolePoint('driver');
    }
    if (checkedValues.find((x) => x == 'passengerTrack')) {
      setPassengerMapPoint(map, pLatLng);
    } else {
      removeRolePoint('passenger');
    }
    if (checkedValues.find((x) => x == 'directionTrack')) {
      if (orderTrackInfo.trackPoints) {
        directionTrajectory();
      }
    } else {
      removeRolePoint('direction');
    }

    // 开启测距
    if (checkedValues.find((x) => x == 'rangingRuler')) {
      ruler = new AMap.RangingTool(map);
      ruler.turnOn();
    } else {
      if (ruler) {
        ruler.turnOff();
      }
    }

    // 开启高德规划
    if (checkedValues.find((x) => x == 'drivingGaode')) {
      gAmapDriving();
    } else {
      if (driving) {
        driving.clear();
      }
    }
  };

  /**
   * @description: 方向轨迹渲染
   * @param {*}
   * @return {*}
   */
  const directionTrajectory = () => {
    const trackPoints = orderTrackInfo.trackPoints;
    let pathArr = [];
    Object.keys(trackPoints).map((key) => {
      let path = [trackPoints[key]['loc:lng'], trackPoints[key]['loc:lat']];
      pathArr.push(path);
    });

    AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
      if (!PathSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！');
        return;
      }
      var colors = ['#3366cc'];
      pathSimplifierIns = new PathSimplifier({
        zIndex: 100,
        map: map, //所属的地图实例

        getPath: function (pathData) {
          return pathData.path;
        },
        getHoverTitle: function (pathData, pathIndex, pointIndex) {
          // console.log(pathData, pointIndex);
          if (pointIndex >= 0) {
            //point
            return `${pathData.name}，经纬度：${JSON.stringify(
              pathArr[pointIndex],
            )}，第${pointIndex}/${pathData.path.length}个点`;
          }

          return pathData.name + '，点数量' + pathData.path.length;
        },
        renderOptions: {
          pathLineStyle: {
            dirArrowStyle: true,
          },
          getPathStyle: function (pathItem, zoom) {
            var color = colors[pathItem.pathIndex % colors.length],
              lineWidth = 5;
            return {
              pathLineStyle: {
                strokeStyle: color,
                lineWidth: lineWidth,
              },
              pathLineSelectedStyle: {
                lineWidth: lineWidth + 2,
              },
              pathNavigatorStyle: {
                fillStyle: color,
              },
            };
          },
        },
      });

      var d = [
        {
          name: `${startingName}->${destName}`,
          path: pathArr,
        },
      ];

      pathSimplifierIns.setData(d);
    });
  };

  /**
   * @description: 开启高德路线规划
   * @param {*}
   * @return {*}
   */
  const gAmapDriving = () => {
    var drivingOption = {
      policy: AMap.DrivingPolicy.LEAST_TIME, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
      ferry: 1, // 是否可以使用轮渡
      province: '京', // 车牌省份的汉字缩写
      map: map,
      panel: 'panel',
    };
    // 构造路线导航类
    driving = new AMap.Driving(drivingOption);
    // 根据起终点经纬度规划驾车导航路线
    driving.search(
      new AMap.LngLat(pLatLng[1].lng, pLatLng[1].lat),
      new AMap.LngLat(pLatLng[2].lng, pLatLng[2].lat),
      function (status, result) {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          log.success('绘制驾车路线完成');
        } else {
          log.error('获取驾车数据失败：' + result);
        }
      },
    );
  };

  return (
    <Spin spinning={false}>
      <Affix style={{ position: 'absolute', top: 23.7, left: 25, zIndex: 10 }}>
        <Checkbox.Group onChange={onChangeTrack} defaultValue={trackType}>
          <Space>
            <Checkbox className="checkbox-track" value="driverTrack">
              司机轨迹
            </Checkbox>
            <Checkbox className="checkbox-track" value="passengerTrack">
              乘客轨迹
            </Checkbox>
            <Checkbox className="checkbox-track" value="directionTrack">
              方向轨迹
            </Checkbox>
            <Checkbox className="checkbox-track" value="drivingGaode">
              对比高德驾车规划
            </Checkbox>
            <Checkbox className="checkbox-track" value="rangingRuler">
              开启测距(点击地图获取量测点，右键或双击左键结束测量)
            </Checkbox>
          </Space>
        </Checkbox.Group>
      </Affix>
      <div id="container"></div>
      <div id="panel"></div>
    </Spin>
  );
};

export default React.memo(MapTrajectory);
