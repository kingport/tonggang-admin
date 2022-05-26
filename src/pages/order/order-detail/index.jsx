import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProSkeleton from '@ant-design/pro-skeleton';

import { billDetailInfo, orderInfo, orderOperationLog, orderTrack } from './service';
import './index.less';
import OrderHeader from './components/OrderHeader';
import RefundModal from './components/orderModal/RefundModal';
import FreeChargeModal from './components/orderModal/FreeChargeModal';
import ChangePriceModal from './components/orderModal/ChangePriceModal';
import FinishOrderModal from './components/orderModal/FinishOrderModal';

const OrderDetail = (props) => {
  const { order_id, status } = props.location.query;

  const [modalKey, setModalKey] = useState();
  const [billDetail, setBillDetail] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [orderTrackInfo, setOrderTrackInfo] = useState(null);

  const [tableLoading, setTableLoading] = useState(false);
  const [operationLogtData, setOperationLogtData] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    getBillDetail();
    getOrderInfo();
    getOrderTrack();
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  /**
   * @description: 查询订单账单详情
   * @param {object} order_id 订单id
   * @return {*}
   */
  const getBillDetail = async () => {
    const params = {
      order_id,
    };
    const res = await billDetailInfo(params);
    if (res) {
      setBillDetail(res.data);
    }
  };

  /**
   * @description: 查询订单账单详情
   * @param {object} order_id 订单id
   * @return {*}
   */
  const getOrderInfo = async () => {
    const params = {
      order_id,
    };
    const res = await orderInfo(params);
    if (res) {
      setOrderData(res.data);
    }
  };

  /**
   * @description: 获取订单轨迹
   * @param {object} order_id 订单id
   * @return {*}
   */
  const getOrderTrack = async () => {
    const params = {
      order_id,
    };
    const res = await orderTrack(params);
    if (res) {
      const { data = {} } = res;
      setOrderTrackInfo(data);
    }
  };

  /**
   * @description: 获取订单操作日志列表，操作时调用
   * @param {string} order_id 订单id
   * @param {string} op_res_type 日志类型
   * @return {*}
   */
  const getOrderOperationLog = async () => {
    setTableLoading(true);
    const params = {
      op_res_id: order_id,
      op_res_type: 1,
    };
    const res = await orderOperationLog(params);
    if (res) {
      const { data = [] } = res;
      const dataSource = data.map((item, index) => {
        item.key = index;
        return item;
      });
      setOperationLogtData(dataSource);
    }
    setTableLoading(false);
  };

  /**
   * @description: 操作弹窗
   * @param {string} type 弹窗类型
   * @return {*}
   */
  const modalChange = (type) => {
    setModalKey(type);
  };

  // 订单详情
  const orderDataObj = useMemo(() => {
    return orderData;
  }, [orderData]);
  // 订单流程
  const billDetailObj = useMemo(() => {
    return billDetail;
  }, [billDetail]);
  // 订单轨迹
  const orderTrackInfoObj = useMemo(() => {
    return orderTrackInfo;
  }, [orderTrackInfo]);

  if (!billDetail || !orderData || !orderTrackInfo) {
    return (
      <div
        style={{
          background: '#fafafa',
          padding: 24,
        }}
      >
        <ProSkeleton type="list" />
      </div>
    );
  }
  // console.log(orderDataObj, 'orderDataObj');
  // console.log(billDetailObj, 'billDetailObj');
  // console.log(orderTrackInfoObj, 'orderTrackInfoObj');
  // console.log(tabKey, 'tabKey');
  return (
    <PageContainer
      title={
        <OrderHeader
          modalChange={modalChange}
          orderData={orderDataObj}
          billDetail={billDetailObj}
          orderTrackInfo={orderTrackInfoObj}
          tableLoading={tableLoading}
          operationLogtData={operationLogtData}
          getOrderOperationLog={getOrderOperationLog}
          updateOrderDetail={getOrderInfo}
          status={status}
        />
      }
    >
      <Modal
        title="退款"
        visible={modalKey == 'showRefundModal'}
        destroyOnClose
        footer={null}
        width={680}
        className="orderModal"
        onCancel={() => setModalKey()}
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <RefundModal
          onCancel={() => setModalKey()}
          orderData={orderData}
          updateOrderDetail={getOrderInfo}
          getOrderOperationLog={getOrderOperationLog}
        />
      </Modal>
      <Modal
        title="免单"
        visible={modalKey == 'showFreeChargeModal'}
        destroyOnClose
        onCancel={() => setModalKey()}
        footer={null}
        width={680}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <FreeChargeModal
          onCancel={() => setModalKey()}
          billDetail={billDetail}
          orderData={orderData}
          updateOrderDetail={getOrderInfo}
          getOrderOperationLog={getOrderOperationLog}
        />
      </Modal>
      <Modal
        title="客服改价"
        visible={modalKey == 'showChangePriceModal'}
        destroyOnClose
        onCancel={() => setModalKey()}
        footer={null}
        width={680}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <ChangePriceModal
          onCancel={() => setModalKey()}
          getOrderOperationLog={getOrderOperationLog}
          billDetail={billDetail}
          orderData={orderData}
          updateOrderDetail={getOrderInfo}
          getBillDetail={getBillDetail}
        />
      </Modal>
      <Modal
        title="关单"
        visible={modalKey == 'showFinishOrderModal'}
        destroyOnClose
        onCancel={() => setModalKey()}
        footer={null}
        width={680}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <FinishOrderModal
          onCancel={() => setModalKey()}
          orderData={orderData}
          updateOrderDetail={getOrderInfo}
          getOrderOperationLog={getOrderOperationLog}
        />
      </Modal>
    </PageContainer>
  );
};

export default OrderDetail;
