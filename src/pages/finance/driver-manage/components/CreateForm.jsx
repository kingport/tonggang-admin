import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { Button, Row, Form, Input, Col, InputNumber, Descriptions, Select, DatePicker } from 'antd';

import { accountBalanceIncrease, accountBalanceReduce } from '../service';
const { Item: FormItem } = Form;
const { TextArea } = Input;

const CreateForm = (props, ref) => {
  const { onCancel, selectRecord, type, getAccountList } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const [form] = Form.useForm();

  const [btnLoading, setBtnLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = async (values) => {
    setBtnLoading(true);
    values.driver_id = selectRecord.driver_id;
    let res;
    if (type == 'award') {
      res = await accountBalanceIncrease(values);
    }
    if ((type = 'penalty')) {
      res = await accountBalanceReduce(values);
    }
    if (res) {
      message.success('操作成功');
      getAccountList();
      onCancel();
    }
    setBtnLoading(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <FormItem
        rules={[
          {
            required: true,
          },
        ]}
        name="cost"
        label={type == 'award' ? '奖励金额' : '惩罚金额'}
      >
        <InputNumber placeholder="请输入" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
          },
        ]}
        name="work_id"
        label="工单ID"
      >
        <Input placeholder="请输入" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
          },
        ]}
        name="remark"
        label="备注"
      >
        <TextArea placeholder="请输入" />
      </FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ margin: '0 8px' }}>
            取消
          </Button>
          <Button loading={btnLoading} type="primary" htmlType="submit">
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(CreateForm);
