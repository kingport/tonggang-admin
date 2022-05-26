/* 账单费用组件 */
import React from 'react';
import { Collapse } from 'antd';
import OrderMessage from './orderMessage';
import PassengerMessage from './passengerMessage';
import DriverMessage from './driverMessage';

const { Panel } = Collapse;

const BillCost = (props) => {
  const { pre_map_type, begun_map_type } = props.orderData;
  const {
    driver_bill = {},
    order_detail = {},
    passenger_bill = {},
    coupon_info = {},
  } = props.billDetail;
  return (
    <div className="billCost">
      <Collapse defaultActiveKey="1">
        <Panel
          showArrow={false}
          header={<span style={{}}>订单信息</span>}
          key="1"
          style={{ marginBottom: 24 }}
        >
          <OrderMessage
            order_detail={order_detail}
            pre_map_type={pre_map_type}
            begun_map_type={begun_map_type}
          />
        </Panel>
      </Collapse>
      <Collapse defaultActiveKey="1">
        <Panel showArrow={false} header="乘客" key="1" style={{ marginBottom: 24 }}>
          <PassengerMessage coupon_info={coupon_info} passenger_bill={passenger_bill} />
        </Panel>
      </Collapse>
      <Collapse defaultActiveKey="1">
        <Panel showArrow={false} header="司机" key="1">
          <DriverMessage driver_bill={driver_bill} />
        </Panel>
      </Collapse>
    </div>
  );
};

export default BillCost;
