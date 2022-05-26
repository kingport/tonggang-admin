/* 生成虚拟号组件 */
import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col, Select, Typography } from 'antd';
import { createVirtualNum } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;
const { Paragraph } = Typography;

const VirtualModal = (props) => {
  const { onCancel, phoneList, order_id } = props;
  const [form] = Form.useForm();
  const [virtualNum, setVirtualNum] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  const submitOperation = async () => {
    setButtonLoading(true);
    try {
      const values = await form.validateFields();
      if (values) {
        const params = {
          ...values,
        };
        const res = await createVirtualNum(params);
        if (res) {
          message.success('操作成功，虚拟号已生成', 4);
          setVirtualNum(res.data.v_phone);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setButtonLoading(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Row style={{ marginTop: 10 }}>绑定座机号和订单号，生成虚拟号</Row>
      <FormItem
        rules={[{ required: true, message: '请输入订单号' }]}
        name="order_id"
        label="订单号"
        initialValue={order_id}
      >
        <Input style={{ width: 180 }} placeholder="请输入订单号" />
      </FormItem>
      <FormItem name="phone" rules={[{ required: true, message: '请输入座机号' }]} label="座机号">
        <Select style={{ width: 180 }} showSearch allowClear placeholder="请选择座机号">
          {phoneList.map((item) => {
            return (
              <Option value={item} key={item}>
                {item}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      {virtualNum && (
        <Row style={{ paddingLeft: 16 }}>
          <Col span={3} style={{ color: '#000000d9' }}>
            虚拟号:
          </Col>
          <Col span={13}>
            <Paragraph copyable>{virtualNum}</Paragraph>
          </Col>
        </Row>
      )}
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button style={{ display: 'inline-block' }} onClick={onCancel}>
            取消
          </Button>
          <Button
            style={{ display: 'inline-block', marginLeft: 8 }}
            onClick={submitOperation}
            type="primary"
            loading={buttonLoading}
          >
            关联
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default VirtualModal;
