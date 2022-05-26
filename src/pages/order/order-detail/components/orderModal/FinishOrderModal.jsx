/* 结束订单组件 */
import React, { useState } from 'react';
import { Form, Input, Button, Row, message, Col } from 'antd';
import { closeOrder } from '../../service';
const { Item: FormItem } = Form;
const { TextArea } = Input;

const FinishOrderModal = (props) => {
  const { onCancel, orderData, updateOrderDetail, getOrderOperationLog } = props;
  const { order_id } = orderData;
  const [form] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);

  // 确认操作
  const submitOperation = async () => {
    setButtonLoading(true);
    try {
      const values = await form.validateFields();
      if (values) {
        const params = {
          order_id,
          ...values,
        };
        const res = await closeOrder(params);
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
    setButtonLoading(false);
  };
  return (
    <Form form={form} layout="vertical">
      <Row style={{ margin: '10px 0' }}>
        结束订单用以辅助司机结束订单，若已计费需要乘客正常支付。
      </Row>
      <FormItem label="工单编号" name="work_id">
        <Input style={{ width: 160 }} placeholder="请输入工单编号" />
      </FormItem>
      <FormItem
        rules={[
          { required: true, message: '请输入关单原因' },
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
        label="关单原因（必填项）"
        name="detail_content"
        colon={false}
      >
        <TextArea rows={4} placeholder="请输入关单原因，限制100个字符" />
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
            loading={buttonLoading}
          >
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FinishOrderModal;
