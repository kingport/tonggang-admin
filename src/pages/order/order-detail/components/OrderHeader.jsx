import React, { useState } from 'react';
import {
  Descriptions,
  Button,
  Tabs,
  PageHeader,
  Modal,
  Typography,
  Tag,
  Form,
  Input,
  message,
} from 'antd';
import { useSelector } from 'dva';
import { history } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { API_ORDER_REFUND, API_ORDER_CLOSE, API_ORDER_FREE, API_ORDER_CHANGE } from '../constant';
import VirtualModal from './virtualModal';
import { servicePhone, cancelOrderJudge } from '../service';

import BillCost from './billCost/index';
import OrderTrack from './orderTrack/index';
import OperationHistory from './operationHistory/index';
import AdvancePayApplyLog from './advancePayApplyLog/index';

const { TabPane } = Tabs;
const { Paragraph } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;

const OrderHeader = (props) => {
  const {
    billDetail,
    orderData,
    orderTrackInfo,
    modalChange,
    tabChange,
  } = props;
  const { tableLoading, operationLogtData, getOrderOperationLog } = props;
  const userInfo = useSelector(({ global }) => global.userInfo);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);

  const [form] = Form.useForm();

  const [showVirtualModal, setShowVirtualModal] = useState(false);
  const [phoneList, setPhoneList] = useState([]);
  const PRICE_TYPE = {
    0: '起步价',
    1: '一口价',
  };

  const {
    order_id,
    order_status_name,
    driver_phone,
    channel_name,
    open_oid,
    city,
    order_status,
    is_pay,
    channel,
    passenger_phone,
    advance,
    price_mode,
    judge_status,
  } = orderData;

  const { driver_bill } = billDetail;

  let operationButton = [];
  // 关单
  if (order_status < 5) {
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_ORDER_CLOSE]) {
      operationButton = [
        <Button key="1" onClick={() => modalChange('showFinishOrderModal')}>
          关单
        </Button>,
      ];
    }
  }
  // 免单和改价
  if (order_status === '5' && is_pay === '0' && advance != 3 && advance != 4) {
    if (
      userInfo &&
      userInfo.agent_type == 0 &&
      userApiAuth &&
      userApiAuth[API_ORDER_FREE] &&
      userApiAuth[API_ORDER_CHANGE]
    ) {
      operationButton = [
        <Button
          disabled={channel == 10100}
          key="2"
          onClick={() => modalChange('showFreeChargeModal')}
        >
          免单
        </Button>,
        <Button key="4" onClick={() => modalChange('showChangePriceModal')}>
          客服改价
        </Button>,
      ];
    }
  }
  // 已支付 退款
  if (order_status === '5' && is_pay === '1') {
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_ORDER_REFUND]) {
      operationButton = [
        <Button key="3" onClick={() => modalChange('showRefundModal')}>
          退款
        </Button>,
      ];
    }
  }
  // 退款
  if (
    (order_status == '7' || order_status == '11') &&
    driver_bill &&
    driver_bill.cancel_fee * 1 > 0 &&
    is_pay === '1' &&
    advance != 3 &&
    advance != 4
  ) {
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_ORDER_REFUND]) {
      operationButton = [
        <Button key="3" onClick={() => modalChange('showRefundModal')}>
          退款
        </Button>,
      ];
    }
  }

  // 免单
  if (
    (order_status == '7' || order_status == '11') &&
    driver_bill &&
    driver_bill.cancel_fee * 1 > 0 &&
    is_pay === '0' &&
    advance != 3 &&
    advance != 4
  ) {
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_ORDER_FREE]) {
      operationButton = [
        <Button
          disabled={channel == 10100}
          key="2"
          onClick={() => modalChange('showFreeChargeModal')}
        >
          免单
        </Button>,
      ];
    }
  }

  /**
   * @description: 乘客账号绑定虚拟账号组件
   * @param {*}
   * @return {*}
   */
  const getPassengerPhone = () => {
    return (
      <span>
        <Button style={{ marginLeft: 5 }} size="small" type="primary" onClick={ShowVirtualModal}>
          关联虚拟号
        </Button>
      </span>
    );
  };

  /**
   * @description: 获取关联手机号
   * @param {*}
   * @return {*}
   */
  const getServicePhone = async () => {
    const res = await servicePhone();
    if (res) {
      setPhoneList(res.data);
    }
  };

  /**
   * @description: 判责给司机
   * @param {*}
   * @return {*}
   */
  const rulingDriver = async () => {
    confirm({
      title: '确定判责司机？',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form form={form} layout="vertical">
          <Form.Item name="remark" label={<Tag color="red">请谨慎处理，只可操作一次改判！</Tag>}>
            <TextArea placeholder="选填，在此处输入备注内容" />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const values = form.getFieldsValue();
        const params = {
          order_id: order_id,
          ...values,
        };
        const res = await cancelOrderJudge(params);
        if (res) {
          message.success('操作成功');
          history.push(`/order/order-detail?order_id=${order_id}&status=1`);
        }
      },
      onCancel() {},
    });
  };

  // 显示关联
  const ShowVirtualModal = () => {
    setShowVirtualModal(true);
    getServicePhone();
  };

  const passengerPhone = channel === '10000' ? getPassengerPhone() : passenger_phone;

  return (
    <>
      <PageHeader
        style={{ padding: 0 }}
        extra={operationButton}
        onBack={() => window.history.back()}
        title="订单详情"
        footer={
          <Tabs
            className="orderTabs"
            defaultActiveKey="orderTrack"
            style={{ marginTop: 0 }}
            onChange={tabChange}
          >
            <TabPane tab="订单轨迹" key="orderTrack">
              <OrderTrack
                orderTrackInfo={orderTrackInfo}
                orderData={orderData}
                billDetail={billDetail}
              />
            </TabPane>
            <TabPane tab="账单费用" key="billCost">
              <BillCost orderData={orderData} billDetail={billDetail} />
            </TabPane>
            <TabPane tab="垫付申请记录" key="advancePayApplyLog">
              <AdvancePayApplyLog orderData={orderData} />
            </TabPane>
            <TabPane tab="操作历史" key="operationHistory">
              <OperationHistory
                tableLoading={tableLoading}
                operationLogtData={operationLogtData}
                getOrderOperationLog={getOrderOperationLog}
              />
            </TabPane>
          </Tabs>
        }
      >
        <Descriptions size="middle" column={4}>
          <Descriptions.Item label="订单编号">{order_id || '--'}</Descriptions.Item>
          <Descriptions.Item label="计费模式">{PRICE_TYPE[price_mode] || '--'}</Descriptions.Item>
          <Descriptions.Item label="订单状态">{order_status_name || '--'}</Descriptions.Item>
          <Descriptions.Item label="订单来源">{channel_name || '--'}</Descriptions.Item>
          <Descriptions.Item label="支付状态">
            <Tag color={is_pay === '1' ? '#87d068' : '#f50'}>
              {is_pay === '1' ? '已支付' : '未支付'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="乘客电话">{passengerPhone}</Descriptions.Item>
          <Descriptions.Item label="司机电话">{driver_phone || '--'}</Descriptions.Item>
          <Descriptions.Item label="城市">{city || '--'}</Descriptions.Item>
          <Descriptions.Item label="平台垫付">
            {advance == 3 ? '是' : advance == 5 ? '自动垫付' : '否'}
          </Descriptions.Item>
          {open_oid && (
            <Descriptions.Item label="openOid">
              <Paragraph copyable>{open_oid}</Paragraph>
            </Descriptions.Item>
          )}
          {judge_status == 2 && (
            <Descriptions.Item label="司机判责">
              <Button size="small" type="primary" disabled>
                司机有责
              </Button>
            </Descriptions.Item>
          )}
          {judge_status == 1 && (
            <Descriptions.Item label="司机判责">
              <Button size="small" onClick={rulingDriver} type="primary">
                判责司机
              </Button>
            </Descriptions.Item>
          )}
        </Descriptions>
      </PageHeader>
      <Modal
        title="关联虚拟号"
        visible={showVirtualModal}
        destroyOnClose
        onCancel={() => setShowVirtualModal(false)}
        footer={null}
        width={480}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <VirtualModal
          phoneList={phoneList}
          order_id={order_id}
          onCancel={() => setShowVirtualModal(false)}
        />
      </Modal>
    </>
  );
};

export default OrderHeader;
