import { Card } from 'antd';
import { COUPON_TYPE, COUPON_STAUTS } from '@/utils/constant';
import moment from 'moment';
import { useSelector } from 'dva';

const CardGrid = (props) => {
  const detail = props.detail;
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const gridStyle = {
    width: 100 / 7 + '%',
    textAlign: 'center',
    background: '#f6f6f6',
  };
  const gridStyleContent = {
    width: 100 / 7 + '%',
    textAlign: 'center',
    background: '#fff',
    fontWeight: 800,
  };
  let denominationName = '';
  // 面值
  if (detail.denomination) {
    const denominationArr = JSON.parse(detail.denomination);
    denominationArr.map((item, index) => {
      if (index + 1 < denominationArr.length) {
        item = item / 100 + '元、';
      } else {
        item = item / 100 + '元';
      }
      return (denominationName += item);
    });
  }
  // 城市
  let city_name = '';
  let district_name = '';
  if (detail.city) {
    city_name = cityCountyList.find((x) => x.city === detail.city).city_name;
    if (detail.district != 0) {
      district_name = cityCountyList
        .find((x) => x.city === detail.city)
        .county_infos.find((y) => y.county === detail.district).county_name;
    }
  }
  return (
    <Card size="small" title="汇总">
      <Card.Grid hoverable={false} style={gridStyle}>
        优惠券名称
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        优惠券类型
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        使用门槛
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        面值
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        状态
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        可使用地区
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        有效期
      </Card.Grid>

      <Card.Grid style={gridStyleContent}>{detail.coupon_name}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{COUPON_TYPE[detail.coupon_type]}</Card.Grid>
      <Card.Grid style={gridStyleContent}>
        满{detail.threshold && detail.threshold / 100}元可用
      </Card.Grid>
      <Card.Grid style={gridStyleContent}>{denominationName}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{COUPON_STAUTS[detail.status]}</Card.Grid>
      <Card.Grid style={gridStyleContent}>
        {city_name}
        {district_name}
      </Card.Grid>
      <Card.Grid style={gridStyleContent}>
        {moment(detail.begin_time).format('YYYY/MM/DD')}至
        {moment(detail.end_time).format('YYYY/MM/DD')}
      </Card.Grid>

      <Card.Grid hoverable={false} style={gridStyle}>
        总发行量
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        保证金
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        已领取
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        待领取
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        已使用
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        未使用
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        已过期
      </Card.Grid>

      <Card.Grid style={gridStyleContent}>{detail.count}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{detail.cash_deposit}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{detail.gain}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{detail.not_gain}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{detail.used}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{detail.not_use}</Card.Grid>
      <Card.Grid style={gridStyleContent}>--</Card.Grid>
    </Card>
  );
};

export default CardGrid;
