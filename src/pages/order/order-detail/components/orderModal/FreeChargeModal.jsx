/* 免单组件 */
import React from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { freeCharge } from '../../service';

const { Item: FormItem } = Form;
const { TextArea } = Input;

const FreeChargeModal = (props) => {
  const { onCancel, orderData, updateOrderDetail, getOrderOperationLog } = props;
  const { order_id } = orderData;
  const [form] = Form.useForm();

  /**
   * @description: 免单操作
   * @param {string} order_id 订单id
   * @param {object} values 表单信息
   * @return {*} 
   */
  const submitOperation = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        const params = {
          order_id,
          ...values,
        };
        const res = await freeCharge(params);
        if (res) {
          message.success('操作成功');
          onCancel();
          updateOrderDetail();
          getOrderOperationLog();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form layout="vertical" form={form}>
      <Row style={{ margin: '10px 0' }}>将乘客已付款项原路返回。</Row>
      <FormItem name="work_id" label="工单编号">
        <Input style={{ width: 160 }} placeholder="请输入工单编号" />
      </FormItem>
      <FormItem
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
        label="免单原因（必填项）"
        colon={false}
      >
        <TextArea rows={4} placeholder="请输入免单原因，限制100个字符" />
      </FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'right', paddingTop: 12 }}>
          <Button style={{ display: 'inline-block' }} onClick={onCancel}>
            取消
          </Button>
          <Button
            style={{ display: 'inline-block', marginLeft: 8 }}
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

export default FreeChargeModal;
