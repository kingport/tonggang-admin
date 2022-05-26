/* 改价组件 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  InputNumber,
  Col,
  Modal,
  message,
  Divider,
  Space,
  Tag,
} from 'antd';
import _ from 'lodash';
import Price from '../utils/price';
import { toChangeBill } from '../../service';

const { Item: FormItem } = Form;
const { TextArea } = Input;

const ChangePriceModal = (props) => {
  const { onCancel, updateOrderDetail, getBillDetail, getOrderOperationLog } = props;
  const { passenger_bill, driver_bill } = props.billDetail;
  const { order_id, advance } = props.orderData;
  const [form] = Form.useForm();
  const passengerList = new Price(driver_bill, passenger_bill);
  const driverList = new Price(driver_bill, passenger_bill);
  const [passengerParams] = useState(passengerList.passengerPrice());
  const [driverParams] = useState(driverList.driverPrice());

  const [pTotalFee, setPtotalFee] = useState(0);
  const [dTotalFee, setDtotalFee] = useState(0);

  useEffect(() => {
    pfeeChange();
    dfeeChange();
  }, []);

  /**
   * @description: 乘客费用计算
   * @param {object} item 乘客各项付费项
   * @param {string} value 乘客应付每项金额
   * @return {*}
   */
  const pfeeChange = (item, value) => {
    const formData = form.getFieldsValue([
      'p_start_price',
      'p_normal_fee',
      'p_normal_time_fee',
      'p_empty_fee',
      'p_highway_fee',
      'p_bridge_fee',
      'p_park_fee',
      'p_other_fee',
      'p_coupon_fee',
    ]);
    formData[item] = value || 0;
    const data = Object.values(formData || {});
    // 优惠券乘客则为负数
    data[8] = data[8] * -1;
    let pTotal = Number.parseFloat(_.sum(data)).toFixed(2);
    setPtotalFee(pTotal);
  };

  /**
   * @description: 司机费用计算
   * @param {object} item 司机各项收费项
   * @param {string} value 司机每项金额
   * @return {*}
   */
  const dfeeChange = (item, value) => {
    const formData = form.getFieldsValue([
      'd_start_price',
      'd_normal_fee',
      'd_normal_time_fee',
      'd_empty_fee',
      'd_highway_fee',
      'd_bridge_fee',
      'd_park_fee',
      'd_other_fee',
      'info_fee',
    ]);
    formData[item] = value || 0;
    const data = Object.values(formData || {});
    data[8] = data[8] * 1;
    let dTotal = Number.parseFloat(_.sum(data)).toFixed(2);
    setDtotalFee(dTotal);
  };

  /**
   * @description: 提交改价
   * @param {number} dTotalFee 司机改价后费用
   * @param {number} pTotalFee 乘客改价后费用
   * @return {*}
   */
  const submitOperation = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        if (dTotalFee < 0 || pTotalFee <= 0) {
          return message.error('费用必须大于0');
        }
        submitConfirm(values);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description: 提交改价二次确认
   * @param {object} values 所有改价信息
   * @return {*}
   */
  const submitConfirm = (values) => {
    Modal.confirm({
      centered: true,
      title: '确认修改吗？',
      content: '本次编辑修改的内容将即时生效。',
      okText: '确定',
      cancelText: '取消',
      width: 433,
      onOk: async () => {
        const params = {
          order_id,
          reason: values.reason,
          work_id: values.work_id,
          // operator_name: userName,
          passenger_bill: JSON.stringify({
            start_price: values.p_start_price,
            normal_fee: values.p_normal_fee,
            normal_time_fee: values.p_normal_time_fee,
            empty_fee: values.p_empty_fee,
            highway_fee: values.p_highway_fee,
            bridge_fee: values.p_bridge_fee,
            park_fee: values.p_park_fee,
            other_fee: values.p_other_fee,
            coupon_fee: values.p_coupon_fee,
          }),
          driver_bill: JSON.stringify({
            start_price: values.d_start_price,
            normal_fee: values.d_normal_fee,
            normal_time_fee: values.d_normal_time_fee,
            empty_fee: values.d_empty_fee,
            highway_fee: values.d_highway_fee,
            bridge_fee: values.d_bridge_fee,
            park_fee: values.d_park_fee,
            other_fee: values.d_other_fee,
          }),
        };
        const res = await toChangeBill(params);
        if (res) {
          message.success('操作成功');
          onCancel();
          updateOrderDetail();
          getBillDetail();
          getOrderOperationLog();
        }
      },
    });
  };

  return (
    <Form
      style={{
        paddingTop: 10,
      }}
      form={form}
    >
      <FormItem name="work_id" label="工单编号">
        <Input style={{ width: 160 }} placeholder="请输入工单编号" />
      </FormItem>
      <Divider style={{ margin: '10px' }} />
      <FormItem style={{ color: '#000' }}>
        <Space>
          <Tag color="#87d068">乘客支付费用</Tag>
          <span>{`费用总价：${pTotalFee}元`}</span>
        </Space>
      </FormItem>
      <Row>
        {passengerParams.map((item) => {
          return (
            <Col key={item.key} span={8}>
              <Form.Item
                name={item.key}
                label={item.title}
                initialValue={
                  passenger_bill[item.key]
                    ? parseFloat(passenger_bill[item.key].replace(',', ''))
                    : 0.0
                }
              >
                <InputNumber
                  disabled={item.defaultDisabled}
                  min={0}
                  placeholder={item.title}
                  onChange={(value) => pfeeChange(item.key, value)}
                />
              </Form.Item>
            </Col>
          );
        })}
      </Row>
      <Divider style={{ margin: '10px' }} />

      <FormItem style={{ color: '#000' }}>
        <Space>
          <Tag color="#2db7f5"> 司机收到费用（仅支持改动一次）</Tag>
          <span>{`费用总价：${dTotalFee}元`}</span>
          {advance == 5 && <Tag color="red">自动垫付禁止修改司机费用</Tag>}
        </Space>
      </FormItem>
      <Row>
        {driverParams.map((item) => {
          return (
            <Col key={item.key} span={8}>
              <Form.Item
                name={item.key}
                label={item.title}
                initialValue={
                  item.key == 'info_fee'
                    ? `-${1 * driver_bill[item.key]}`
                    : driver_bill[item.key]
                    ? parseFloat(driver_bill[item.key].replace(',', ''))
                    : 0.0
                }
              >
                <InputNumber
                  disabled={advance == 5 ? true : item.defaultDisabled}
                  placeholder={item.title}
                  onChange={(value) => dfeeChange(item.key, value)}
                />
              </Form.Item>
            </Col>
          );
        })}
      </Row>
      <Divider style={{ margin: '10px' }} />
      <FormItem
        label="改价原因（必填项）"
        rules={[
          { required: true, message: '请输入改价原因' },
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
        name="reason"
        colon={false}
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlignLast: 'start',
        }}
      >
        <TextArea rows={4} placeholder="请输入改价原因，限制100个字符" />
      </FormItem>
      <Row style={{ paddingTop: 12 }}>
        <Col style={{ textAlign: 'right' }} span={24}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            style={{ display: 'inline-block', marginLeft: 8 }}
            // loading={buttonDisabled}
            onClick={submitOperation}
            type="primary"
          >
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ChangePriceModal;
