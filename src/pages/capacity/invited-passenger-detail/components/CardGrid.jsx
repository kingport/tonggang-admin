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
  return (
    <Card size="small" title="汇总">
      <Card.Grid hoverable={false} style={gridStyle}>
        邀请者手机号
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        邀请者身份
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        邀请好友数
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        生效中好友数
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        邀请未打车好友数
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        已失效好友数
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        累计奖励（元）
      </Card.Grid>

      <Card.Grid style={gridStyleContent}>{detail.coupon_name}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{COUPON_TYPE[detail.coupon_type]}</Card.Grid>
      <Card.Grid style={gridStyleContent}>
        满{detail.threshold && detail.threshold / 100}元可用
      </Card.Grid>
      <Card.Grid style={gridStyleContent}>{denominationName}</Card.Grid>
      <Card.Grid style={gridStyleContent}>{COUPON_STAUTS[detail.status]}</Card.Grid>
      <Card.Grid style={gridStyleContent}>
        {detail.city && cityCountyList.find((x) => x.city === detail.city).city_name}
      </Card.Grid>
      <Card.Grid style={gridStyleContent}>
        {moment(detail.begin_time).format('YYYY/MM/DD')}至
        {moment(detail.end_time).format('YYYY/MM/DD')}
      </Card.Grid>
    </Card>
  );
};

export default CardGrid;
