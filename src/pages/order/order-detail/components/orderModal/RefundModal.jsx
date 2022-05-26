/* 退款组件 */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, InputNumber, Col, message, Spin } from 'antd';
import { refundInfo, refundOrder } from '../../service';
const { TextArea } = Input;

const RefundModal = (props) => {
  const { orderData, onCancel, updateOrderDetail, getOrderOperationLog } = props;
  const { order_id } = props.orderData;
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refundDetail, setRefundDetail] = useState({});

  useEffect(() => {
    getRefundInfo();
  }, []);

  /**
   * @description: 获取退款信息
   * @param {string} order_id 订单id
   * @return {*}
   */
  const getRefundInfo = async () => {
    setModalLoading(true);
    const params = {
      order_id,
    };
    const res = await refundInfo(params);
    if (res) {
      setRefundDetail(res.data);
    }
    setModalLoading(false);
  };

  /**
   * @description: 确定操作退款
   * @param {object} values 表单信息
   * @return {*}
   */
  const submitOperation = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        if (values.d_refund_cost == 0 && values.p_refund_cost == 0) {
          return message.warning('退款金额为0,禁止操作');
        }
        sumbitRefundOrder(values);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description: 退款
   * @param {object} values 表单信息
   * @param {string} order_id 订单id
   * @return {*}
   */
  const sumbitRefundOrder = async (values) => {
    setButtonLoading(true);
    const params = {
      order_id,
      ...values,
    };
    const res = await refundOrder(params);
    if (res) {
      message.success('操作成功');
      onCancel();
      updateOrderDetail();
      getOrderOperationLog();
    }
    setButtonLoading(false);
  };
  return (
    <Spin spinning={modalLoading} tip="努力加载中...">
      <Form layout="vertical" form={form}>
        <Row style={{ margin: '10px 0' }}>
          调整后价格即为乘客实际支付金额，费用为0即为全额退款。
        </Row>
        <Form.Item name="work_id" label="工单编号">
          <Input style={{ width: 160 }} placeholder="请输入工单编号" />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Row style={{ paddingLeft: 10 }}>{` 可退款金额${
              refundDetail.p_remain_refund_cost || 0
            }元`}</Row>
            <Form.Item
              label="乘客退款金额(元)"
              name="p_refund_cost"
              style={{ marginBottom: 3 }}
              rules={[
                {
                  required: true,
                  message: '请输入金额',
                },
              ]}
              initialValue={0}
            >
              <InputNumber
                disabled={orderData.channel == 10100}
                min={0}
                max={Number(refundDetail.p_remain_refund_cost || 0)}
                placeholder="金额"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Row style={{ paddingLeft: 10 }}>{`司机可退回${
              refundDetail.d_remain_refund_cost || 0
            }元`}</Row>
            <Form.Item
              name="d_refund_cost"
              initialValue={0}
              label="司机退回金额(元)"
              style={{ marginBottom: 3 }}
              rules={[
                {
                  required: true,
                  message: '请输入金额',
                },
              ]}
            >
              <InputNumber
                min={0}
                max={Number(refundDetail.d_remain_refund_cost || 0)}
                placeholder="金额"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          rules={[
            {
              required: true,
              message: '请输入退款原因',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const pattern = /^([\W\w\s]{0,100})$/g;
                if (pattern.test(value) || !value) {
                  return Promise.resolve();
                }
                return Promise.reject('请输入内容为100个字符以内');
              },
            }),
          ]}
          name="detail_content"
          label="退款原因（必填项）"
          colon={false}
        >
          <TextArea rows={4} placeholder="请输入退款原因，限制100个字符" />
        </Form.Item>
        <Row style={{ paddingTop: 12 }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button style={{ display: 'inline-block' }} onClick={onCancel}>
              取消
            </Button>
            <Button
              style={{ display: 'inline-block', marginLeft: 8 }}
              loading={buttonLoading}
              onClick={submitOperation}
              type="primary"
            >
              确定
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default RefundModal;
